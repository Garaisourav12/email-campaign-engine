const { CampaignModel } = require("../models");
const AppError = require("../utils/AppError");

const createCampaign = async (body, userId) => {
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
    throw new AppError("Campaign is ended", 400);
  }

  // RTEMP Logic of finding unreachable nodes
  const unreachableNodes = [];

  // unreachable nodes cannot be updated
  unreachableNodes.forEach((node) => {
    const updatedNode = updates.nodes.find((n) => n.id === node.id);
    if (JSON.stringify(node) !== JSON.stringify(updatedNode)) {
      throw new AppError(`Cannot update unreachable node ${node.id}`, 400);
    }
  });

  const visitedNodes = campaign.visitedNodes.sort();
  const updatedVisitedNodes = updates.visitedNodes.sort();
  if (visitedNodes.join("") !== updatedVisitedNodes.join("")) {
    throw new AppError("Cannot update visitedNodes list manually", 400);
  }

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

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaign,
  getCampaigns,
  getCampaignTemplates,
};
