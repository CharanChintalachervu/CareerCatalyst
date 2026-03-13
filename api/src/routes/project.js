import express from "express";
import Project from "../models/project.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new project with slots
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, tags, slots } = req.body;
    const project = await Project.create({
      title,
      description,
      tags,
      slots: slots || [],
      ownerId: req.user.id,
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects (public feed)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("ownerId", "name email professionalRole occupation")
      .populate("collaborators.userId", "name professionalRole")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get logged-in user's own projects
router.get("/me", auth, async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user.id })
      .populate("collaborators.userId", "name professionalRole")
      .populate("applications.userId", "name professionalRole occupation")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("ownerId", "name email professionalRole occupation")
      .populate("collaborators.userId", "name email professionalRole occupation")
      .populate("applications.userId", "name email professionalRole occupation");
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply to a project for a specific role slot
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const { professionalRole, message } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Check if already applied
    const alreadyApplied = project.applications.some(
      a => a.userId.toString() === req.user.id
    );
    if (alreadyApplied)
      return res.status(400).json({ error: "You have already applied to this project" });

    // Check if already a collaborator
    const alreadyCollaborator = project.collaborators.some(
      c => c.userId.toString() === req.user.id
    );
    if (alreadyCollaborator)
      return res.status(400).json({ error: "You are already a collaborator" });

    // Check if the slot exists and has space
    const slot = project.slots.find(s => s.professionalRole === professionalRole);
    if (!slot)
      return res.status(400).json({ error: "No slot found for this role" });
    if (slot.filled >= slot.count)
      return res.status(400).json({ error: "This slot is already filled" });

    project.applications.push({ userId: req.user.id, professionalRole, message });
    await project.save();
    res.json({ message: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept or reject an application (owner only)
router.patch("/:id/applications/:appId", auth, async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.ownerId.toString() !== req.user.id)
      return res.status(403).json({ error: "Only the project owner can manage applications" });

    const application = project.applications.id(req.params.appId);
    if (!application) return res.status(404).json({ error: "Application not found" });

    application.status = status;

    if (status === "accepted") {
      // Add to collaborators
      project.collaborators.push({
        userId: application.userId,
        professionalRole: application.professionalRole,
      });
      // Update slot filled count
      const slot = project.slots.find(s => s.professionalRole === application.professionalRole);
      if (slot) slot.filled += 1;
      // Update project status
      if (project.status === "open") project.status = "in-progress";
    }

    await project.save();
    res.json({ message: `Application ${status}`, project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a project (owner only)
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
