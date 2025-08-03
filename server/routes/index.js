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
      data: emailTemplates,
      message: "Email templates fetched successfully",
    });
  } catch (err) {
    next(err);
  }
});
router.get("/templates", async (req, res, next) => {
  const { event, campainId, nodeId } = req.params;
  try {
    await campaignService.updateEventState(event, campainId, nodeId);
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
