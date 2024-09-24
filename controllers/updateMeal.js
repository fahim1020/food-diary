const jwt = require("jsonwebtoken");
const User = require("../models/user");

const updateMeal = async (req, res) => {
  const { name, meal } = req.body;

  if (!name || meal === undefined) {
    return res.status(400).json({ message: "Name and meal are required" });
  }

  try {
    // Get the token from the cookies
    const token = req.cookies.auth;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the person
    const person = user.peoples.find((person) => person.name === name);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    // Calculate the difference in meal value
    const mealDifference = meal - person.meal;

    // Update the person's meal value
    person.meal = meal;

    // Update the totalMeal field
    user.totalMeal += mealDifference;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Person updated successfully!" });
  } catch (error) {
    console.error("Error updating person:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateMeal;
