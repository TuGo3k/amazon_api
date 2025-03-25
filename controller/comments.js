const myError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate-sequelize");

exports.createComment = asyncHandler(async (req, res, next) => {
  const comment = await req.db.comment.create(req.body);

  res.status(200).json({
    succes: true,
    data: comment,
  });
});

// /api/comments/:id
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new myError(req.params.id + " ID-тэй коммент байхгүй.", 400);
  }

  comment = await comment.update(req.body);

  res.status(200).json({
    succes: true,
    data: comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  let comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new myError(req.params.id + " ID-тэй коммент байхгүй.", 400);
  }

  await comment.destroy();

  res.status(200).json({
    succes: true,
    data: comment,
  });
});

exports.getComment = asyncHandler(async (req, res, next) => {
  let comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new myError(req.params.id + " ID-тэй коммент байхгүй.", 400);
  }

  res.status(200).json({
    succes: true,
    data: comment,
  });
});

exports.getComments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 4;

  const sort = req.query.sort;

  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const start = (page - 1) * limit; // Corrected start calculation

  const pagination = await paginate(page, limit, req.db.comment);

  let query = {offset: pagination.start-1, limit };

  if (req.query) {
    query.where = req.query;
  }

  if (select) {
    query.attributes = select;
  }

  const comments = await req.db.comment.findAll(query);
  // .sort(sort)
  // .skip(pagination.start)
  // .limit(limit);

  res.status(200).json({
    success: true,
    // array: arr,
    data: query,
    comments,
    // pagination,
  });
});
