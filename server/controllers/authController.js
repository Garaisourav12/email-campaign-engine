const { authService } = require("../services");

const register = async (req, res, next) => {
  try {
    const newUser = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: newUser,
      message: "Registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { accessToken, user } = await authService.login(req.body);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      success: true,
      data: { accessToken, user },
      message: "Logged in successfully",
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const profile = await authService.getProfile(user.id);

    res.status(200).json({
      success: true,
      data: profile,
      message: "Token verified successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
};
