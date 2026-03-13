import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
