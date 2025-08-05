const router = require("express").Router();

const validateToken = require("../middlewares/authMiddleware");
const { campaignService } = require("../services");
const emailTemplates = require("../utils/emailTemplates");
const authRouter = require("./authRoutes");
const campaignRouter = require("./campaignRoutes");

router.use("/auth", authRouter);
router.use("/campaigns", validateToken, campaignRouter);

router.get("/getEmailTemplates", async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: Object.values(emailTemplates || {}).map((t) => {
        return {
          id: t.templateId,
          name: t.name,
          events: t.events,
        };
      }),
      message: "Email templates fetched successfully",
    });
  } catch (err) {
    next(err);
  }
});
router.get("/templates", async (req, res, next) => {
  const { event, campaignId, nodeId } = req.query;
  try {
    await campaignService.updateEventState(event, campaignId, nodeId);
    res.status(200).json({
      success: true,
      data: null,
      message: "Event state updated successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
