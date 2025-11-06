import express from "express";
import Follow from "../models/follow.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ✅ Follow a user
router.post("/:id/follow", auth, async (req, res) => {
  try {
    if (req.user.id === req.params.id)
      return res.status(400).json({ error: "You cannot follow yourself" });

    await Follow.create({ follower: req.user.id, following: req.params.id });
    res.json({ message: "Followed" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ error: "Already following" });
    res.status(500).json({ error: err.message });
  }
});

// ✅ Unfollow a user
router.post("/:id/unfollow", auth, async (req, res) => {
  try {
    await Follow.deleteOne({ follower: req.user.id, following: req.params.id });
    res.json({ message: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get logged-in user's following list
router.get("/me/following", auth, async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.user.id }).populate("following", "name email occupation");
    res.json(following.map(f => f.following));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get logged-in user's followers list
router.get("/me/followers", auth, async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.user.id }).populate("follower", "name email occupation");
    res.json(followers.map(f => f.follower));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
