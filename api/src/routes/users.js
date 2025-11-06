import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all users (for explore page)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-passwordHash").limit(100);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get logged-in user's profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-passwordHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Suggest users with similar interests or occupation
router.get("/suggestions", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ error: "User not found" });

    const query = {
      _id: { $ne: me._id },
      $or: [
        { occupation: me.occupation },
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
