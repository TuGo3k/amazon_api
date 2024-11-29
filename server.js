const express = require("express");
const dotenv = require("dotenv");
var fs = require('fs')
var rfs = require('rotating-file-stream')
var morgan = require('morgan')
var path = require('path')
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
// const morgan = require('morgan')
// Load environment variables
dotenv.config({ path: "./config/config.env" });

var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})

// Connect to MongoDB
connectDB();

const app = express();



// Body parser middleware
app.use(express.json());



app.use(logger);
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// Import routes
const categoriesRoutes = require("./routes/categories");

// Mount routes
app.use("/api/v1/categories", categoriesRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Express сервер ${PORT} порт дээр ажиллаж байна.`)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Алдаа гарлаа: ${err.message}`);
  server.close(() =>
  process.exit(1))
})