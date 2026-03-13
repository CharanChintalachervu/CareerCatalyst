import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: String,
    occupation: String,         // student / freelancer / employee / startup
    role: String,               // AI classified: student / freelancer / employee
    professionalRole: String,   // SDE / DevOps / Designer / etc.
    interests: [String],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
