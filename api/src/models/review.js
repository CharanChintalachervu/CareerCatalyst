import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, maxlength: 500 },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
);

ReviewSchema.index({ reviewerId: 1, revieweeId: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);
