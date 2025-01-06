const Book = require("../models/Book");
const Category = require("../models/Category");
const myError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

// api/v1/books
// api/v1/categories/:categoryId/books

exports.getBooks = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.categoryId) {
    query = Book.find({ category: req.params.categoryId });
  } else {
    query = Book.find().populate({
      path: "category",
      select: "name averagePrice",
    });
  }

  const books = await query;

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

  res.status(200).json({
    success: true,
    data: book,
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