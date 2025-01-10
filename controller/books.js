const Book = require("../models/Book");
const path = require("path");
const Category = require("../models/Category");
const myError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

// api/v1/books
exports.getBooks = asyncHandler(async (req, res, next) => {

  const books = await Book.find().populate({
    path: "category",
    select: "name averagePrice",
  });;

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

// api/v1/categories/:categoryId/books
exports.getCategoryBooks = asyncHandler(async (req, res, next) => {

  const books = await Book.find({ category: req.params.categoryId });;

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});


exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new myError(req.params.id + " ID-тэй ном байхгүй байна", 404);
  }

  const avg = await Book.computeCategoryAveragePrice(book.category);

  res.status(200).json({
    success: true,
    data: book,
    dundaj: avg,
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    throw new myError(req.body.category + " ID-тэй категори байхгүй.", 400);
  }

  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new myError(req.params.id + " ID-тэй категори байхгүй.", 400);
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!book) {
    throw new myError(req.params.id + " ID-тэй ном байхгүй.", 400);
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

//PUT: api/v1/books/:id/photo
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new myError(req.params.id + " ID-тэй ном байхгүй.", 400);
  }

  // image upload

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new myError("Та зураг upload хийнэ үү.", 400);
  }
  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new myError("Таны зурагны хэмжээ хэтэрсэн байна.", 400);
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new myError(
        "Файлыг хуулах явцад алдаа гарлаа.Алдаа: " + err.message,
        400
      );
    }

    book.photo = file.name
    book.save()

    res.status(200).json({
      succes: true,
      data: file.name,
    });
  });
});
