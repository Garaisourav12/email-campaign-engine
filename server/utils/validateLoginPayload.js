const AppError = require("./AppError");
const validator = require("validator");

const validateLoginPayload = (body) => {
  const { email, password } = body;
  if (!email) {
    throw new AppError("Email is required", 400, "Bad Request");
  }

  if (validator.isEmail(email) === false) {
    throw new AppError("Invalid email", 400, "Bad Request");
  }

  if (!password) {
    throw new AppError("Password is required", 400, "Bad Request");
  }
};

module.exports = validateLoginPayload;
