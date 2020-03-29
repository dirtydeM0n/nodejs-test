const mongoose = require("mongoose");
const userModel = require("./userModel");
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  is_done: {
    type: Boolean,
    default: false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel
  },
  created_on: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("todo", todoSchema);
