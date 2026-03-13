import express from "express";
import Review from "../models/review.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Submit a review
router.post("/", auth, async (req, res) => {
  try {
    const { revieweeId, rating, text, projectId } = req.body;
    if (revieweeId === req.user.id)
      return res.status(400).json({ error: "Cannot review yourself" });

    const review = await Review.create({
      reviewerId: req.user.id,
      revieweeId,
      rating,
      text,
      projectId,
    });
    res.json(review);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ error: "You already reviewed this user" });
    res.status(500).json({ error: err.message });
  }
});

// Get reviews for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate("reviewerId", "name email occupation")
      .sort({ createdAt: -1 });

    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, averageRating: avg.toFixed(1), count: reviews.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
