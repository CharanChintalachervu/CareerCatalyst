import express from "express";
import axios from "axios";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Classify interests → role, and optionally save professionalRole
router.post("/classify", auth, async (req, res) => {
  try {
    const { interests, professionalRole } = req.body;
    const resp = await axios.post(`${process.env.ML_BASE_URL}/classify`, { interests });
    const { role, probabilities } = resp.data;

    const updateData = { role, interests };
    if (professionalRole) updateData.professionalRole = professionalRole;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    res.json({ role, probabilities, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
