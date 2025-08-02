const { campaignService } = require("../services");

const createCampaign = async (req, res, next) => {
  try {
    // TODO: Add logic to create campaign
    const data = await campaignService.createCampaign(req.body, req.user.id);
    res
      .status(201)
      .json({ success: true, data, message: "Campaign created successfully" });
  } catch (err) {
    next(err);
  }
};

const updateCampaign = async (req, res, next) => {
  try {
    // TODO: Add logic to update campaign by req.params.id
    const data = await campaignService.updateCampaign(
      req.params.id,
      req.body,
      req.user.id
    );
    res
      .status(200)
      .json({ success: true, data, message: "Campaign updated successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteCampaign = async (req, res, next) => {
  try {
    // TODO: Add logic to delete campaign by req.params.id
    const data = await campaignService.deleteCampaign(
      req.params.id,
      req.user.id
    );
    res
      .status(200)
      .json({ success: true, data, message: "Campaign deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getCampaign = async (req, res, next) => {
  try {
    // TODO: Add logic to get single campaign by req.params.id
    const data = await campaignService.getCampaign(req.params.id, req.user.id);
    res
      .status(200)
      .json({ success: true, data, message: "Campaign fetched successfully" });
  } catch (err) {
    next(err);
  }
};

const getCampaigns = async (req, res, next) => {
  try {
    // TODO: Add logic to return all campaigns
    const data = await campaignService.getCampaigns(req.user.id);
    res
      .status(200)
      .json({ success: true, data, message: "Campaigns fetched successfully" });
  } catch (err) {
    next(err);
  }
};

const getCampaignTemplates = async (req, res, next) => {
  try {
    // TODO: Return dummy/static templates (if needed)
    const data = await campaignService.getCampaignTemplates(req.user.id);
    res
      .status(200)
      .json({
        success: true,
        data,
        message: "Campaign Templates fetched successfully",
      });
  } catch (err) {
    next(err);
  }
};

const executeCampaign = async (req, res, next) => {
  try {
    // TODO: Add logic to execute campaign (e.g., simulate campaign flow)
  } catch (err) {
    next(err);
  }
};

const pauseCampaign = async (req, res, next) => {
  try {
    // TODO: Add logic to pause campaign by req.params.id
  } catch (err) {
    next(err);
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
