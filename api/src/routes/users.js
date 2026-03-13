import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const { professionalRole, occupation } = req.query;
    const filter = {};
    if (professionalRole) filter.professionalRole = professionalRole;
    if (occupation) filter.occupation = occupation;
    const users = await User.find(filter, "-passwordHash").limit(100);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get logged-in user's profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-passwordHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update professional role
router.patch("/me/professional-role", auth, async (req, res) => {
  try {
    const { professionalRole } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { professionalRole },
      { new: true, select: "-passwordHash" }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Suggest users with similar interests or professional role
router.get("/suggestions", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ error: "User not found" });

    const query = {
      _id: { $ne: me._id },
      $or: [
        { occupation: me.occupation },
        { professionalRole: me.professionalRole },
        { interests: { $in: me.interests || [] } },
      ],
    };

    const suggestions = await User.find(query, "-passwordHash").limit(10);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
