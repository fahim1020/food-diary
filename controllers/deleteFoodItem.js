const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const deleteFoodItem = async (req, res) => {
  const { name, price } = req.body;
  try {
    const token = req.cookies.auth;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const itemIndex = user.market.findIndex(
      (item) => item.name === name && item.price === price
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Food item not found" });
    }

    user.market.splice(itemIndex, 1);
    user.totalCost -= Number(price);
    user.totalContribute += Number(price);

    await user.save();

    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = deleteFoodItem;
