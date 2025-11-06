import express from "express";
import axios from "axios";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Proxy classify interests to ML service
router.post("/classify", auth, async (req, res) => {
  try {
    const { interests } = req.body;
    const resp = await axios.post(`${process.env.ML_BASE_URL}/classify`, { interests });
    const { role, probabilities } = resp.data;

    // save role on user
    const user = await User.findByIdAndUpdate(req.user.id, { role, interests }, { new: true });

    res.json({ role, probabilities, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;