const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  meal: {
    type: Number,
    required: true,
  },
  contribute: {
    type: Number,
    default: 0,
  },
});

const marketSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  peoples: [personSchema],
  totalMeal: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  totalContribute: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  market: [marketSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
