import express from "express";
import Project from "../models/project.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new project
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const project = await Project.create({
      title,
      description,
      tags,
      ownerId: req.user.id,
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects (public feed)
router.get("/", async (req, res) => {
  const projects = await Project.find().populate("ownerId", "name email");
  res.json(projects);
});

// Get a user’s own projects
router.get("/me", auth, async (req, res) => {
  const projects = await Project.find({ ownerId: req.user.id });
  res.json(projects);
});

// Delete a project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.ownerId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });
    await project.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
