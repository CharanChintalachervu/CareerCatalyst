import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Expect "Bearer <token>"
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token format is 'Bearer <token>'" });
  }

  const token = parts[1];
  console.log("JWT_SECRET in auth middleware:", process.env.JWT_SECRET);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user payload to request
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
