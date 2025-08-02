const router = require("express").Router();

const validateToken = require("../middlewares/authMiddleware");
const authRouter = require("./authRoutes");
const campaignRouter = require("./campaignRoutes");

router.use("/auth", authRouter);
router.use("/campaigns", validateToken, campaignRouter);

module.exports = router;
