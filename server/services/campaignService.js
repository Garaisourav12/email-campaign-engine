const { CampaignModel } = require("../models");
const AppError = require("../utils/AppError");
const { sleep, formatDuration } = require("../utils/common");
const { io, getSocketId } = require("../socket");
const emailTemplates = require("../utils/emailTemplates");
const { default: sendMail } = require("../utils/sendEmail");

const createCampaign = async (body, userId) => {
  const { _id } = body;

  if (_id) {
    delete body["_id"];
  }

  const campaign = await CampaignModel.create({
    ...body,
    userId,
  });

  if (!campaign) {
    throw new AppError("Failed to create campaign", 500);
  }
  return campaign;
};

const updateCampaign = async (campaignId, updates, userId) => {
  const campaign = await CampaignModel.findById(campaignId);

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  if (campaign.userId.toString() !== userId) {
    throw new AppError("Not authorized to access this campaign", 403);
  }

  const state = campaign.state;

  if (campaign.state !== updates.state) {
    throw new AppError("Cannot update campaign state manually", 400);
  }

  if (state === "ended") {
    throw new AppError("Cannot update ended campaign", 400);
  }

  if (state === "active") {
    throw new AppError("Cannot update active campaign", 400);
  }

  if (campaign.customerEmail !== updates.customerEmail) {
    throw new AppError("Cannot update customer email manually", 400);
  }

  // unreachable nodes cannot be updated
  // campaign.nodes.forEach((node, index) => {
  //   if (
  //     campaign.unreachableNodes.includes(node.id) &&
  //     JSON.stringify(node) !== JSON.stringify(updates.nodes[index])
  //   ) {
  //     throw new AppError("Cannot update unreachable nodes", 400);
  //   }
  // });

  const updatedCampaign = new CampaignModel({
    ...updates,
  });

  const updated = await updatedCampaign.save();

  // const updated = await CampaignModel.findByIdAndUpdate(campaignId, {
  //   $set: updates,
  // });

  return updated;
};

const deleteCampaign = async (campaignId, userId) => {
  const campaign = await CampaignModel.findById(campaignId);

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  if (campaign.userId.toString() !== userId) {
    throw new AppError("Not authorized to access this campaign", 403);
  }

  const deleted = await CampaignModel.findByIdAndDelete(campaignId);

  return deleted;
};

const getCampaign = async (campaignId, userId) => {
  const campaign = await CampaignModel.findById(campaignId);

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  if (campaign.userId.toString() !== userId) {
    throw new AppError("Not authorized to access this campaign", 403);
  }

  const campaignObj = campaign.toObject();
  return {
    ...campaignObj,
    nodes: campaignObj.nodes.map(({ _id, events, branches, ...rest }) => {
      return {
        ...rest,
        events: events.map(({ _id, ...rest }) => rest),
        branches: branches.map(({ _id, ...rest }) => rest),
      };
    }),
  };
};

const getCampaigns = async (userId) => {
  return CampaignModel.find({ userId: userId }).sort({ createdAt: -1 });
};

const getCampaignTemplates = async () => {
  return CampaignModel.find({ user: userId, customerEmail: null }).sort({
    createdAt: -1,
  });
};

const executeCampaign = async (campaignId, userId) => {
  const campaign = await CampaignModel.findById(campaignId);

  if (userId !== campaign.userId) {
    throw new AppError("Not authorized to access this campaign", 403);
  }

  if (campaign.state === "ended") {
    throw new AppError("Cannot execute ended campaign", 400);
  }

  if (campaign.state === "active") {
    throw new AppError("Campaign is already active", 400);
  }

  if (campaign.customerEmail === null) {
    throw new AppError("Cannot execute campaign without customer email", 400);
  }

  campaign.state = "active";
  if (await campaign.save()) {
    io.to(getSocketId(campaign.userId)).emit("updateCampaign", campaign);
    executeNode(campaignId);
  }
};

const pauseCampaign = async (campaignId, userId) => {
  const campaign = await CampaignModel.findById(campaignId);

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  if (userId !== campaign.userId) {
    throw new AppError("Not authorized to access this campaign", 403);
  }

  campaign.state = "paused";
  if (await campaign.save()) {
    io.to(getSocketId(campaign.userId)).emit("updateCampaign", campaign);
  }
};

const executeNode = async (campaignId) => {
  const campaign = await CampaignModel.findById(campaignId);
  if (campaign.state !== "active") {
    return;
  }
  const node = campaign.nodes.find((n) => n.id === campaign.currentNodeId);

  switch (node.type) {
    case "Start":
      campaign.visitedNodes.push(node.next);
      break;
    case "SendEmail":
      const emailTemplate = emailTemplates[node.emailTemplateId];
      if (!emailTemplate) {
        console.error(`Email template ${node.emailTemplateId} not found`);
        return;
      }
      await sendMail({
        to: campaign.customerEmail,
        subject: emailTemplate.getSubject(customerEmail.split("@")[0]),
        html: emailTemplate.getBody(
          customerEmail.split("@")[0],
          campaignId,
          node.id
        ),
      });
      campaign.visitedNodes.push(node.next);
      break;
    case "Wait":
      await sleep(formatDuration(node.duration) ?? 600000); // default to 10 minutes
      campaign.visitedNodes.push(node.next);
      break;
    case "Condition":
      const dependentNode = campaign.nodes.find(
        (n) => n.id === node.dependentOn
      );

      if (dependentNode.type !== "SendEmail") {
        const defaultBranch = node.branches.find((b) => b.event === "default");
        campaign.visitedNodes.push(defaultBranch.next);
      } else {
        const eventStates = dependentNode.events.reduce((acc, event) => {
          acc[event.name] = event.state;
          return acc;
        }, {});

        if (eventStates["purchase"] === "completed") {
          const purchaseBranch = node.branches.find(
            (b) => b.event === "purchase"
          );
          campaign.visitedNodes.push(purchaseBranch.next);
        } else if (eventStates["click"] === "completed") {
          const clickBranch = node.branches.find((b) => b.event === "click");
          campaign.visitedNodes.push(clickBranch.next);
        } else if (eventStates["open"] === "completed") {
          const openBranch = node.branches.find((b) => b.event === "open");
          campaign.visitedNodes.push(openBranch.next);
        } else if (node.hasRemainder) {
          const remainderBranch = node.branches.find(
            (b) => b.event === "remainder"
          );
          campaign.nodes = campaign.nodes.map((n) => {
            if (n.id === remainderBranch.next) {
              return { ...n, hasRemainder: false };
            } else {
              return n;
            }
          });
          campaign.visitedNodes.push(remainderBranch.next);
        } else {
          const defaultBranch = node.branches.find(
            (b) => b.event === "default"
          );
          campaign.visitedNodes.push(defaultBranch.next);
        }
      }
      break;
    case "End":
      campaign.state = "ended";
      break;
  }
  if (await campaign.save()) {
    io.to(getSocketId(campaign.userId)).emit("updateCampaign", campaign);
    if (campaign.state === "ended") {
      return;
    }
    executeNode(campaignId);
  }
};

const updateEventState = async (event, campaignId, nodeId) => {
  const campaign = await CampaignModel.findById(campaignId);
  campaign.nodes = campaign.nodes.map((n) => {
    if (n.id === nodeId) {
      return {
        ...n,
        events: n.events.map((e) =>
          e.name === event ? { ...e, state: "completed" } : e
        ),
      };
    } else {
      return n;
    }
  });

  if (await campaign.save()) {
    io.to(getSocketId(campaign.userId)).emit("updateCampaign", campaign);
  }
};

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaign,
  getCampaigns,
  getCampaignTemplates,
  executeCampaign,
  pauseCampaign,
  updateEventState,
};
