const jwt = require("jsonwebtoken");
const User = require("../models/user");

const addFoodItem = async (req, res) => {
  const { state, name, price } = req.body;

  // Check for valid input
  if (!state || !name || price < 0) {
    return res.status(400).send("Invalid input.");
  }

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

    // Add the food item to the user's market array
    user.market.push({ state, name, price });
    // Update totalCost
    user.totalCost += Number(price);
    user.totalContribute -= Number(price);
    await user.save();

    res.status(201).send("Food item added.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
};

module.exports = addFoodItem;
