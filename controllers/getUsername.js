const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getUsername = async (req, res) => {
  const token = req.cookies.auth;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    res.json({
      username: username,
    });
  } catch (error) {
    console.error("Invalid token", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
module.exports = getUsername;
