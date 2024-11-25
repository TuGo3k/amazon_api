const express = require("express");
const dotenv = require("dotenv");
//Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");
// Аппын тохиоргоог process.env рүү ачааллах
dotenv.config({ path: "./config/config.env" });

const app = express();

//Categories route-ийг use ашиглаж холбож байнаgbxbx
app.use("/api/v1/categories", categoriesRoutes);

app.listen(
  process.env.PORT,
  console.log(`Express server, ${process.env.PORT} порт дээр аслаа`)
);
