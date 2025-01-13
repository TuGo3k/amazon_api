const Book = require("../models/Book");
const path = require("path");
const Category = require("../models/Category");
const myError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");

// api/v1/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 5;

  const sort = req.query.sort;

  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const start = (page - 1) * limit; // Corrected start calculation

  const pagination = await paginate(page, limit, Book);

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});
exports.getUserBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 5;

  const sort = req.query.sort;

  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const start = (page - 1) * limit; // Corrected start calculation

  const pagination = await paginate(page, limit, Book);

  req.query.createUser = req.userId;

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

// api/v1/categories/:categoryId/books
exports.getCategoryBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 5;

  const sort = req.query.sort;

  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const start = (page - 1) * limit; // Corrected start calculation

  const pagination = await paginate(page, limit, Book);
  //req.query, select
  const books = await Book.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
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

  req.body.createUser = req.userId;

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
  const user = User.findById(req.userId);
  await book.deleteOne();

  res.status(200).json({
    success: true,
    data: book,
    whoDeleted: user.name,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  req.body.updateUser = req.userId;

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

    book.photo = file.name;
    book.save();

    res.status(200).json({
      succes: true,
      data: file.name,
    });
  });
});
