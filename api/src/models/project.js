import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
  professionalRole: { type: String, required: true }, // "SDE", "DevOps", etc.
  count: { type: Number, default: 1 },
  filled: { type: Number, default: 0 },
});

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  professionalRole: { type: String, required: true },
  message: String,
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  appliedAt: { type: Date, default: Date.now },
});

const CollaboratorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  professionalRole: String,
  joinedAt: { type: Date, default: Date.now },
});

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slots: [SlotSchema],                    // open role slots
    applications: [ApplicationSchema],      // who applied
    collaborators: [CollaboratorSchema],    // accepted members with roles
    status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
