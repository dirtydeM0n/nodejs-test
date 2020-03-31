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
    // We don't really need reference in our cases so going with basic flow
    // type: mongoose.Schema.Types.ObjectId,
    // ref: userModel,
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("todo", todoSchema);
