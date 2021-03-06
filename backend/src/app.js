require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const verification = require("./services/middleware");

// ** Routes

const cors = require("cors");

mongoose.Promise = global.Promise;
const mongoUri = process.env.MONGOURI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  connectTimeoutMS: 1000,
  useFindAndModify: false
});

const app = express();

app.use(cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
console.log("server connected");
app.use("/api/users", require("./routes/users"));
app.use("/api/todo", verification, require("./routes/todo"));
module.exports = app;
