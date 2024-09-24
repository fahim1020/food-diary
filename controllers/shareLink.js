const User = require("../models/user.js");

const shareLink = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user by their username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalMeal = user.totalMeal;
    const totalCost = user.totalCost;

    // Calculate per meal cost for each person
    const perMealData = user.peoples.map((person) => ({
      name: person.name,
      perMealCost: totalMeal > 0 ? (totalCost / totalMeal) * person.meal : 0, // Avoid division by zero
    }));

    // Respond with all required data
    res.status(200).json({
      totalMeals: totalMeal,
      totalCost: totalCost,
      perMealData: perMealData,
      peoples: user.peoples,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = shareLink;
