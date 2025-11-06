import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";



import authRoutes from "./routes/auth.js";
import mlRoutes from "./routes/ml.js";
import projectRoutes from "./routes/project.js";
import userRoutes from "./routes/users.js";
import followRoutes from "./routes/follow.js";






dotenv.config(); // ✅ load .env first
const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ routes
app.use("/auth", authRoutes);
app.use("/ml", mlRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/follow", followRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ connect db + start
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
  })
  .catch(err => console.error("DB connection error:", err));


// ✅ optional: global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong" });
});
