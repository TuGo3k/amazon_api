const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables
const colors = require("colors"); // Ensure colors package is installed

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB холбогдлоо: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`MongoDB холболтын алдаа: ${error.message}`.red.underline.bold);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;
