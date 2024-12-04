const Category = require("../models/Category");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      succes: true,
      data: categories,
    });
  } catch (err) {
    res.status(400).json({
      succes: false,
      error: err,
    });
  }
};
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(400).json({
        success: false,
        error: req.params.id + " ID-тэй категори байхгүй.",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};
exports.createCategory = async (req, res, next) => {
  console.log("data: ", req.body);

  try {
    const category = await Category.create(req.body);

    res.status(200).json({
      succes: true,
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      succes: false,
      error: err.message,
    });
  }
};
exports.updateCategory = (req, res, next) => {
  res.status(200).json({
    succes: true,
    data: `${req.params.id} id тай категорийг өөрчилнө`,
  });
};
exports.deleteCategory = (req, res, next) => {
  res.status(200).json({
    succes: true,
    data: `${req.params.id} id тай категорийг устгана`,
  });
};
