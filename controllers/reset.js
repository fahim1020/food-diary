const jwt = require("jsonwebtoken");
const User = require("../models/user");

const reset = async (req, res) => {
  try {
    const token = req.cookies.auth;

    if (!token) {
      return res.status(401).json({ error: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    // Update only the specified fields
    const result = await User.updateOne(
      { username },
      {
        $set: {
          peoples: [],
          totalMeal: 0,
          totalCost: 0,
          market: [],
        },
      }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Settings have been reset." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = reset;
