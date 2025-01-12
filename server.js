const express = require("express");
const dotenv = require("dotenv");
var fs = require("fs");
var rfs = require("rotating-file-stream");
var morgan = require("morgan");
var path = require("path");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");

const colors = require("colors");
const errorHandler = require("./middleware/error");
const fileupload = require('express-fileupload')
// Import routes
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");

const app = express();

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
connectDB();

var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

// Body parser middleware

app.use(express.json());
app.use(fileupload());

app.use(logger);
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// Mount routes
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Express сервер ${PORT} порт дээр ажиллаж байна.`.rainbow)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа: ${err.message}`.red.underline.bold);
  server.close(() => process.exit(1));
});
