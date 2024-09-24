const jwt = require("jsonwebtoken");
const User = require("../models/user");

const overview = async (req, res) => {
  const token = req.cookies.auth;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const totalMeal = user.totalMeal;
    const totalCost = user.totalCost;
    const totalContribute = user.totalContribute || 0; // Ensure totalContribute is defined

    // Calculate per meal cost for each person
    const perMealData = user.peoples.map((person) => ({
      name: person.name,
      perMealCost: totalMeal > 0 ? (totalCost / totalMeal) * person.meal : 0, // Avoid division by zero
    }));

    res.json({
      totalMeals: totalMeal,
      totalCost: totalCost,
      perMealData: perMealData,
      totalContributions: totalContribute,
    });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = overview;
