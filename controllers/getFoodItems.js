const jwt = require("jsonwebtoken");
const User = require("../models/user");
const getFoodItems = async (req, res) => {
  try {
    const token = req.cookies.auth;

    if (!token) {
      return res.status(401).send("No token provided.");
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Return the user's market data
    res.json(user.market);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
};

module.exports = getFoodItems;
