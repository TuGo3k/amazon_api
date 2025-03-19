const Category = require("../models/Category");
const myError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require('../utils/paginate')



exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 100;

  const sort = req.query.sort;

  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const start = (page - 1) * limit; // Corrected start calculation

  const pagination = await paginate(page, limit, Category)


  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(pagination.start)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: categories,
    pagination,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate(
    'books'
  )

  if (!category) {
    throw new myError(req.params.id + " ID-тэй категори байхгүй.", 403);
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});
exports.createCategory = asyncHandler(async (req, res, next) => {
  console.log("data: ", req.body);

  const category = await Category.create(req.body);

  res.status(200).json({
    succes: true,
    data: category,
  });
});
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new myError(req.params.id + " ID-тэй категори байхгүй.", 400);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new myError(req.params.id + " ID-тэй категори байхгүй.", 400);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    data: category,
  });
});
