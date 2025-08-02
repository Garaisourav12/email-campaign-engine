const authRouter = require("express").Router();
const authController = require("../controllers/authController");
const validateToken = require("../middlewares/authMiddleware");

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/logout", authController.logout);
authRouter.get("/profile", validateToken, authController.getProfile);

module.exports = authRouter;
