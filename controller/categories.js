exports.getCategories = (req, res, next) => {
    res.status(400).json({
        succes: true,
        data: "Бүх категоруудыг энд өгнө...",
      });
}
exports.getCategory = (req, res, next) => {
    res.status(400).json({
        succes: true,
        data: `${req.params.id} ID тэй категорийн мэдээллийг өгнө`,
      });
}
exports.createCategory = (req, res, next) => {
    res.status(400).json({
        succes: true,
        data: "Шинээр категори үүсгэх",
      });
}
exports.updateCategory = (req, res, next) => {
    res.status(400).json({
        succes: true,
        data: `${req.params.id} id тай категорийг өөрчилнө`,
      });
}
exports.deleteCategory = (req, res, next) => {
    res.status(400).json({
        succes: true,
        data: `${req.params.id} id тай категорийг устгана`,
      });
}

