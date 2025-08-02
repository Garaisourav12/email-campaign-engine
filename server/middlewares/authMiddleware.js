const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  try {
    if (!accessToken) {
      throw new AppError("Token not found", 401, "Unauthorized");
    }

    const user = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (!user || !user.id) {
      throw new AppError("Invalid token", 401, "Unauthorized");
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401, "Unauthorized"));
    } else if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401, "Unauthorized"));
    } else {
      return next(err);
    }
  }
};

module.exports = validateToken;
