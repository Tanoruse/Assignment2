// models/Project.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectName: { type: String, required: true },
  description: { type: String },
  team: { type: Schema.Types.ObjectId, ref: "Team" },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Project", projectSchema);
