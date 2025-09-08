const Task = require("./../models/task");
const { successResponse, errorResponse } = require("../utils/response");

exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json(successResponse("Task created", task));
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(successResponse("Tasks retrieved", tasks));
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json(errorResponse("Task not found"));
    res.json(successResponse("Task updated", task));
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json(errorResponse("Task not found"));
    res.json(successResponse("Task deleted", task));
  } catch (error) {
    next(error);
  }
};
