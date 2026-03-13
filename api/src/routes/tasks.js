import express from "express";
import Task from "../models/task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create task for a project
router.post("/", auth, async (req, res) => {
  try {
    const { projectId, title, description, assigneeId, dueDate } = req.body;
    const task = await Task.create({
      projectId,
      title,
      description,
      assigneeId,
      dueDate,
      createdBy: req.user.id,
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).populate("assigneeId", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task status
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.createdBy.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });
    await task.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
