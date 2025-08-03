const AppError = require("./AppError");

const errorHandler = async (err, req, res, next) => {
  console.log(err.message);

  if (err instanceof AppError) {
    return res
      .status(200)
      .json({ success: false, message: err.message, error: err.error });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: "Something went wrong",
  });
};

module.exports = errorHandler;
