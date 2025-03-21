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
const fileupload = require("express-fileupload");
// Import routes
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const injectDb = require("./middleware/injectDb");

const app = express();

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const db = require("./config/db-mysql");

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
// injectDb middleware-р db-г бүх route-д дамжуулж байна
app.use(injectDb(db));
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// Mount routes
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use(errorHandler);

db.user.belongsToMany(db.book, { through: "comment" });
db.book.belongsToMany(db.user, { through: "comment" });
db.category.hasMany(db.book);
db.book.belongsTo(db.category);

// db-mysql-д зарласан db.sequelize = sequelize энд ашиглаж дараа нь db.sequelize.sync() хийгээд database руу холбож өгнө
db.sequelize
  .sync()
  .then((result) => {
    console.log("sync хийгдлээ...".green);
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Express сервер ${PORT} порт дээр ажиллаж байна.`.rainbow)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа: ${err.message}`.red.underline.bold);
  server.close(() => process.exit(1));
});
