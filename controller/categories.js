const Category = require("../models/Category");
const myError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 100;

  const sort = req.query.sort;

  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const start = (page - 1) * limit; // Corrected start calculation

  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(start)
    .limit(limit);

  // Pagination
  const total = await Category.countDocuments(req.query); // Use req.query to match filtered results
  const pageCount = Math.ceil(total / limit);
  let end = page * limit;
  if (end > total) end = total;
  const pagination = { total, pageCount, start: start + 1, end, limit };

  if (page < pageCount) pagination.nextPage = page + 1;
  if (page > 1) pagination.prevPage = page - 1;

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
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new myError(req.params.id + " ID-тэй категори байхгүй.", 400);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});
