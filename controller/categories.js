const Category = require("../models/Category");
const myError = require("../utils/myError");
// const asyncHandler = require("../middleware/asyncHandler");
const asyncHandler = require("express-async-handler");
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    succes: true,
    data: categories,
  });
});
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

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
