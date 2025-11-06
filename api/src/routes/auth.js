import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, occupation, interests } = req.body;

    if (!name || !email || !password || !phone || !occupation) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check duplicate email or phone
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
      occupation,
      interests,
    });
    console.log("JWT_SECRET in auth.js:", process.env.JWT_SECRET);
    // sign JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, occupation: user.occupation },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login (email or phone)
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body; 
    // identifier = email OR phone

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, occupation: user.occupation },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;