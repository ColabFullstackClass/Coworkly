const mongoose = require("mongoose");
const validator = require("validator");

const subTaskSchema = momgoose.Schema({
  title: {
    type: String,
    required: [true, "please provide a title"],
    unique: true,
  },
  isCompleted: {
    type: boolean,
    default: false,
  },
  todo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todo",
    required: true,
  },
});

const todoSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a name for todo"],
    unique: true,
    validate: validator.isAlpha,
  },
  description: {
    type: String,
  },
  subTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subtask",
    },
  ],
  completed: {
    type: Date,
    default: null,
  },
  dueDate: Date,
  isExpired: {
    type: boolean,
    default: false,
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = {
  Todo: mongoose.model("Todo", todoSchema),
  Subtask: mongoose.model("Substack", subTaskSchema),
};
