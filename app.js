const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info("connected to mongodb");
  })
  .catch((err) => {
    logger.error("error connecting to mongodb: ", err.message);
  });

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);

module.exports = { app };
