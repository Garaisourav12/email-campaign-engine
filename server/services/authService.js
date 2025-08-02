const { UserModel } = require("../models");
const AppError = require("../utils/AppError");
const validateLoginPayload = require("../utils/validateLoginPayload");
const bcrypt = require("bcryptjs");
const validateRegisterPayload = require("../utils/validateRegisterPayload");
const jwt = require("jsonwebtoken");

const register = async (body) => {
  const { email, password } = body;

  validateRegisterPayload(body);

  const user = await UserModel.findOne({ email });

  if (user) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

  const newUser = await UserModel.create({ email, password: hashedPassword });

  if (!newUser) {
    throw new AppError("Failed to create user", 500, "Something went wrong");
  }

  return newUser;
};

const login = async (body) => {
  const { email, password } = body;

  validateLoginPayload(body);

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 401);
  }

  const passWordMatched = await bcrypt.compare(password, user.password);

  if (!passWordMatched) {
    throw new AppError("Invalid password", 401);
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return accessToken;
};

const getProfile = async (userId) => {
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

module.exports = {
  register,
  login,
  getProfile,
};
