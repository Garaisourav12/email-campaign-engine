const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const routes = require("./routes");
const connectDB = require("./connectDB");
const errorHandler = require("./utils/errorHandler");
const { app, server } = require("./socket");
const sendMail = require("./utils/sendMail");

dotenv.config();

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

server.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}, ${process.env.BASE_URL}`);
  // sendMail({ to: "garaisourav12@gmail.com", subject: "Test", html: "Test" });
});
