const jwt = require("jsonwebtoken");
const User = require("../models/user");

const addPerson = async (req, res) => {
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

    // Check if the person with the same name already exists
    const personExists = user.peoples.some((person) => person.name === name);
    if (personExists) {
      return res
        .status(400)
        .json({ message: "Person with this name already exists" });
    }

    // Prepare the person data
    const personData = {
      name,
      meal,
    };

    // Add the new person to the peoples array
    user.peoples.push(personData);
    // Update the totalMeal field
    user.totalMeal += Number(meal);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Person added successfully!", user });
  } catch (error) {
    console.error("Error adding person:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = addPerson;
