const jwt = require("jsonwebtoken");
const User = require("../models/user");

const deletePerson = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
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

    // Find the person to delete
    const personToDelete = user.peoples.find((person) => person.name === name);
    if (!personToDelete) {
      return res.status(404).json({ message: "Person not found" });
    }

    // Ensure meal values are numbers
    const personMeal = Number(personToDelete.meal);
    if (isNaN(personMeal)) {
      return res.status(500).json({ message: "Invalid meal value" });
    }

    // Remove the person from the peoples array
    user.peoples = user.peoples.filter((person) => person.name !== name);

    // Update the totalMeal field
    user.totalMeal -= personMeal;

    // Ensure totalMeal is a number
    user.totalMeal = Number(user.totalMeal);
    if (isNaN(user.totalMeal)) {
      return res.status(500).json({ message: "Invalid total meal value" });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Person deleted successfully!" });
  } catch (error) {
    console.error("Error deleting person:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = deletePerson;
