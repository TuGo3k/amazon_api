const mongoose = require("mongoose");
const { transliteration, slugify } = require("transliteration")

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
    max: [10, "Рэйтинг хамгийн ихдээ 10 байх ёстой"],
  },
  averagePrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
  },
},{toJSON:{virtuals: true}, toObject : {virtuals: true}});

CategorySchema.virtual('books', {ref: 'Book',
  localField: '_id',
  foreignField: 'category',
  justOne: false
})


CategorySchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  console.log("removing.........");
  await this.model('Book').deleteMany({ category: this._id });
  next();
});

//    slugify
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name)
  this.averageRating = Math.floor(Math.random()*10) + 1;
  this.averagePrice = Math.floor(Math.random()*100000) + 3000;
  next();
});


// ("моделын нэр" + ямар schema ашиглахийг зааж өгнө)
module.exports = mongoose.model("Category", CategorySchema);
