const mongoose = require("mongoose");
const validator = require("validator");
const emailTemplates = require("../utils/emailTemplates");
const AppError = require("../utils/AppError");

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    name: {
      type: String,
      enum: ["click", "open", "purchase"],
      required: true,
      unique: true,
    },
    state: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      required: true,
    },
  },
  { _id: false }
);

// 1. Condition branches schema
const conditionBranchSchema = new Schema(
  {
    event: {
      type: String,
      enum: ["click", "open", "purchase", "remainder", "default"],
      required: true,
    },
    next: { type: String },
  },
  { _id: false }
);

// 2. Node schema
const nodeSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["SendEmail", "Wait", "Condition", "End"],
      required: true,
    },
    level: { type: Number, required: true },
    next: { type: String },
    emailTemplateId: {
      type: String,
      enum: [
        "welcome_email",
        "offer_email",
        "reminder_email",
        "thankyou_email",
      ],
    },
    events: { type: [eventSchema], required: true, default: [] },
    duration: { type: String },
    dependentOn: { type: String },
    hasRemainder: { type: Boolean },
    branches: { type: [conditionBranchSchema], required: true, default: [] },
  },
  { _id: false }
);

// 3. Campaign schema
const campaignSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    customerEmail: { type: String },
    state: {
      type: String,
      enum: ["default", "active", "paused", "ended"],
      required: true,
      default: "default",
    },
    nodes: {
      type: [nodeSchema],
      required: true,
      default: [{ id: "n1", type: "End", level: 1 }],
    },
    visitedNodes: {
      type: [String],
      required: true,
      default: ["n1"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

campaignSchema.virtual("currentNodeId").get(function () {
  return this.visitedNodes[this.visitedNodes.length - 1];
});

campaignSchema.virtual("unreachableNodes").get(function () {
  const currentNode = this.nodes.find((n) => n.id === this.currentNodeId);
  return this.nodes
    .filter((n) => {
      return n.level <= currentNode.level;
    })
    .map((n) => n.id);
});

// --- VALIDATION LOGIC ---
function validateCampaign(campaign, next) {
  if (!campaign.name) {
    return next(new AppError("Campaign name is required", 400));
  }

  if (campaign.customerEmail && !validator.isEmail(campaign.customerEmail)) {
    return next(new AppError("Invalid customer email", 400));
  }

  if (!["default", "active", "paused", "ended"].includes(campaign.state)) {
    return next(new AppError("Invalid campaign state", 400));
  }

  if (!campaign.nodes || campaign.nodes.length === 0) {
    campaign.nodes = [{ id: "n1", type: "End" }];
  }

  const nodes = campaign.nodes;
  const ids = nodes.map((n) => n.id).filter(Boolean);
  let lastIdNum = Math.max(
    ...ids.map((id) => parseInt(id.replace("n", ""), 10)).filter(Number),
    0
  );

  function validateNode(node) {
    if (!node.type) {
      return next(new AppError(`Node (${node.id}) is missing 'type'`, 400));
    }

    const validTypes = ["SendEmail", "Wait", "Condition", "End"];
    if (!validTypes.includes(node.type)) {
      return next(
        new AppError(`Invalid node type '${node.type}' in node ${node.id}`, 400)
      );
    }
    console.log(campaign);
    switch (node.type) {
      case "SendEmail":
        if (
          !node.emailTemplateId ||
          [
            "welcome_email",
            "offer_email",
            "reminder_email",
            "thankyou_email",
          ].includes(node.emailTemplateId)
        ) {
          return next(
            new AppError(
              `SendEmail node (${node.id}) requires valid emailTemplateId`,
              400
            )
          );
        }

        if (!node.next) {
          const newNode = {
            id: `n${++lastIdNum}`,
            type: "End",
            level: node.level + 1,
          };
          nodes.push(newNode);
          node.next = newNode.id;
        }
        break;

      case "Wait":
        if (!node.duration) {
          node.duration = "1d";
        }
        if (!node.next) {
          const newNode = {
            id: `n${++lastIdNum}`,
            type: "End",
            level: node.level + 1,
          };
          nodes.push(newNode);
          node.next = newNode.id;
        }
        break;

      case "Condition":
        if (!node.dependentOn || !Array.isArray(node.branches)) {
          return next(
            new AppError(
              `Condition node (${node.id}) requires 'dependentOn' and 'branches'`,
              400
            )
          );
        }

        const hasDefault = node.branches.some((b) => b.event === "default");
        if (!hasDefault) {
          const newNode = {
            id: `n${++lastIdNum}`,
            type: "End",
            level: node.level + 1,
          };
          nodes.push(newNode);
          node.branches.push({ event: "default", next: newNode.id });
        }

        if (node.hasRemainder) {
          const remainderBranch = node.branches.find(
            (b) => b.event === "remainder"
          );
          if (!remainderBranch) {
            node.branches.push({ event: "remainder", next: node.dependentOn });
          }
        }
        break;
    }
  }

  for (const node of nodes) {
    if (!node.id) {
      node.id = `n${++lastIdNum}`;
    }
    validateNode(node);
  }

  return next();
}

// --- HOOKS ---

// For save
campaignSchema.pre("save", function (next) {
  validateCampaign(this, next);
});

// For update
campaignSchema.pre(["findOneAndUpdate", "findOneAndReplace"], function (next) {
  const update = this.getUpdate();
  const campaign = update?.$set || update;
  if (campaign) {
    validateCampaign(campaign, next);
  } else {
    next();
  }
});

module.exports = mongoose.model("Campaign", campaignSchema);
