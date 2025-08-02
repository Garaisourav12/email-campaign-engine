const campaignRouter = require("express").Router();
const { campaignController } = require("../controllers");

campaignRouter.post("/create", campaignController.createCampaign);
campaignRouter.put("/update/:id", campaignController.updateCampaign);
campaignRouter.delete("/delete/:id", campaignController.deleteCampaign);
campaignRouter.get("/:id", campaignController.getCampaign);
campaignRouter.get("/templates", campaignController.getCampaignTemplates);
campaignRouter.post("/", campaignController.getCampaigns);
campaignRouter.get("/:id/execute", campaignController.executeCampaign);
campaignRouter.get("/:id/pause", campaignController.pauseCampaign);

module.exports = campaignRouter;
