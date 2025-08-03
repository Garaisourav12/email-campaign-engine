const { CampaignModel } = require("../models");
const AppError = require("../utils/AppError");

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
  campaign.nodes.forEach((node, index) => {
    if (
      campaign.unreachableNodes.includes(node.id) &&
      JSON.stringify(node) !== JSON.stringify(updates.nodes[index])
    ) {
      throw new AppError("Cannot update unreachable nodes manually", 400);
    }
  });

  const updated = await CampaignModel.findByIdAndUpdate(campaignId, {
    $set: updates,
  });

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

  return campaign;
};

const getCampaigns = async (userId) => {
  return CampaignModel.find({ user: userId }).sort({ createdAt: -1 });
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

  executeNode(campaign);
};

const pauseCampaign = async (campaignId, userId) => {};

const executeNode = async (campaign) => {
  const node = campaign.nodes.find(
    (n) => n.id === campaign.visitedNodes[campaign.visitedNodes.length - 1]
  );

  switch (node.type) {
    case "SendEmail":
      // RTEMP send email
      campaign.visitedNodes.push(node.next);
      await campaign.save();
      executeNode(campaign);
      break;
    case "Condition":
      // RTEMP condition check
      campaign.visitedNodes.push(node.next);
      await campaign.save();
      executeNode(campaign);
      break;
    case "End":
      campaign.state = "ended";
      break;
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
};
