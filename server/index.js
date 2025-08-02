const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes");
const connectDB = require("./connectDb");
const errorHandler = require("./utils/errorHandler");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api", routes);
app.use(errorHandler);

app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}, http://localhost:${port}`);
});
