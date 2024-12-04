const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Категорийн нэрийг оруулна уу!"],
    unique: true,
    trim: true,
    maxlenght: [50, "Категорийн нэрний урт дээд тал нь 50 байх ёстой"],
  },
  description: {
    type: String,
    required: [true, "Категорийн тайлбарыг заавал оруулах ёстой"],
    maxlenght: [
      200,
      "Категорийн тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой.",
    ],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  averageRating: {
    type: Number,
    min: [1, "Рэйтинг хамгийн багадаа 1 байх ёстой"],
    max: [1, "Рэйтинг хамгийн ихдээ 10 байх ёстой"],
  },
  averagePrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ("моделын нэр" + ямар schema ашиглахийг зааж өгнө)
module.exports = mongoose.model("Category", CategorySchema);