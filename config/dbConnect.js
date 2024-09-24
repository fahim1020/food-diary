const mongoose = require("mongoose");
async function dbConnect() {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    console.log("Database connection failed");
  }
}
module.exports = dbConnect;
