const router = require("express").Router();

const validateToken = require("../middlewares/authMiddleware");
const emailTemplates = require("../utils/emailTemplates");
const authRouter = require("./authRoutes");
const campaignRouter = require("./campaignRoutes");

router.use("/auth", authRouter);
router.use("/campaigns", validateToken, campaignRouter);
router.get("/getEmailTemplates", (req, res, next) => {
  try {
    res
      .status(200)
      .json({
        success: true,
        data: emailTemplates,
        message: "Email templates fetched successfully",
      });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
