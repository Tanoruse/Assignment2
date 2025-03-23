// models/Team.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  teamName: { type: String, required: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  slogan: { type: String }, // Example custom field
});

module.exports = mongoose.model("Team", teamSchema);
