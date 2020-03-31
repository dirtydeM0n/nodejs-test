const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Todo = require("../models/todoModel");
const verification = require("../services/middleware");

// Login controller
router.post("/createtask", async (req, res) => {
  try {
    let task = await Todo.create({ ...req.body });
    return res.status(200).json({ status: "pass", task_id: task._id });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ status: "fail", mesasge: "Server Error" });
  }
});

router.post("/marktask", async (req, res) => {
  try {
    let task = await Todo.findByIdAndUpdate(
      { _id: req.body.task_id },
      { is_done: req.body.is_done },
      { new: true }
    );
    if (task == null) {
      return res
        .status(404)
        .json({ status: "fail", mesasge: "task not found" });
    }
    return res
      .status(200)
      .json({ status: "pass", message: "task status changed successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ status: "fail", mesasge: "Server Error" });
  }
});

router.post("/edittask/:taskid", async (req, res) => {
  try {
    let task = await Todo.findByIdAndUpdate(
      { _id: req.params.taskid },
      { ...req.body },
      { new: true }
    );
    if (task == null) {
      return res
        .status(404)
        .json({ status: "fail", mesasge: "task not found" });
    }
    return res
      .status(200)
      .json({ status: "pass", message: "task updated changed successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ status: "fail", mesasge: "Server Error" });
  }
});

// Getting all tasks by user's id
router.get("/getallusertask/:userid", async (req, res) => {
  try {
    let tasks = await Todo.find({ user_id: req.params.userid });
    if (tasks.length < 1) {
      return res
        .status(404)
        .json({ status: "fail", mesasge: "tasks not found" });
    }
    return res.status(200).json({ status: "pass", tasks: tasks });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ status: "fail", mesasge: "Server Error" });
  }
});

// deleting a single task
router.delete("/deletetask/:taskid", async (req, res) => {
  try {
    let task = await Todo.findByIdAndDelete(req.params.taskid);
    if (task == null) {
      return res
        .status(404)
        .json({ status: "fail", mesasge: "task not found" });
    }
    return res
      .status(200)
      .json({ status: "pass", message: "task deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ status: "fail", mesasge: "Server Error" });
  }
});

module.exports = router;
