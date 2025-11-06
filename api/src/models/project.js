// api/models/Project.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
