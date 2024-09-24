const jwt = require("jsonwebtoken");
const User = require("../models/user");

const contribute = async (req, res) => {
  try {
    const token = req.cookies.auth;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    // Find the user by their username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.method === "POST") {
      const { name, amount } = req.body;

      // Validate input
      if (!name || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid input" });
      }

      // Update total cost and add contribution
      user.totalContribute += Number(amount);

      // Find person by name and add contribution
      const person = user.peoples.find((p) => p.name === name);
      if (person) {
        person.contribute += Number(amount);
      } else {
        user.peoples.push({ name, contribute: amount, meal: 0 });
      }

      await user.save();
      return res
        .status(200)
        .json({ message: "Contribution added successfully" });
    } else if (req.method === "GET") {
      // Return the list of contributors
      return res.status(200).json(user.peoples);
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling contribution request:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = contribute;
