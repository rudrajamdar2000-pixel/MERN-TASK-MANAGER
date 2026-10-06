const Task = require("../models/Task");
const { validateObjectId } = require("../utils/validation");

exports.getTasks = async (req, res) => {
  try {
    const { search, priority, status } = req.query;

    const query = {
      user: req.user.id,
    };

    // Search
    if (search) {
      query.description = {
        $regex: search,
        $options: "i",
      };
    }

    // Priority filter
    if (priority) {
      query.priority = priority;
    }

    // Completion status filter
    if (status === "completed") {
      query.completed = true;
    }

    if (status === "pending") {
      query.completed = false;
    }

    const tasks = await Task.find(query);

    res.status(200).json({
      tasks,
      status: true,
      msg: "Tasks found successfully..",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({
        status: false,
        msg: "Task id not valid",
      });
    }

    const task = await Task.findOne({
      user: req.user.id,
      _id: req.params.taskId,
    });

    if (!task) {
      return res.status(400).json({
        status: false,
        msg: "No task found..",
      });
    }

    res.status(200).json({
      task,
      status: true,
      msg: "Task found successfully..",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.postTask = async (req, res) => {
  try {
    const { description, priority, dueDate, completed } = req.body;

    if (!description) {
      return res.status(400).json({
        status: false,
        msg: "Description of task not found",
      });
    }

    const task = await Task.create({
      user: req.user.id,
      description,
      priority,
      dueDate: dueDate || null,
      completed: completed || false,
    });

    res.status(200).json({
      task,
      status: true,
      msg: "Task created successfully..",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.putTask = async (req, res) => {
  try {
    const { description, priority, dueDate, completed } = req.body;

    if (!description) {
      return res.status(400).json({
        status: false,
        msg: "Description of task not found",
      });
    }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({
        status: false,
        msg: "Task id not valid",
      });
    }

    let task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(400).json({
        status: false,
        msg: "Task with given id not found",
      });
    }

    if (task.user != req.user.id) {
      return res.status(403).json({
        status: false,
        msg: "You can't update task of another user",
      });
    }

    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        description,
        priority,
        dueDate: dueDate || null,
        completed: completed ?? false,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      task,
      status: true,
      msg: "Task updated successfully..",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({
        status: false,
        msg: "Task id not valid",
      });
    }

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(400).json({
        status: false,
        msg: "Task with given id not found",
      });
    }

    if (task.user != req.user.id) {
      return res.status(403).json({
        status: false,
        msg: "You can't delete task of another user",
      });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(200).json({
      status: true,
      msg: "Task deleted successfully..",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};
