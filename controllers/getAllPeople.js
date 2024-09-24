const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getAllPeople = async (req, res) => {
  try {
    const token = req.cookies.auth; 
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    res.status(200).json({ people: user.peoples });
  } catch (error) {
    console.error("Error fetching people:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getAllPeople;
