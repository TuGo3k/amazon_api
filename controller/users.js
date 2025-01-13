const User = require("../models/User");
const myError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require('../utils/paginate')


// register
exports.register = asyncHandler(async (req, res, next) => {

  const user = await User.create(req.body)

  const token = user.getJsonWebToken()

  res.status(200).json({
    succes: true,
   token,
    users: user,

  });
});
//login хийнэ
exports.login = asyncHandler(async (req, res, next) => {

const {email, password} = req.body

//Оролтыг шалгана

if(!email || !password){
  throw myError('Имэйл болон нууц үгээ дамжуулна уу', 400)
}

// Тухайн хэрэглэгчийн хайна
const user = await User.findOne({ email }).select('+password')

if(!user){
  throw new myError('Имэйл болон нууц үгээ зөв оруулна уу', 401)
}

const ok = await user.checkPassword(password)

if(!ok){
  throw new myError('Имэйл болон нууц үгээ зөв оруулна уу', 400)
}

  

  res.status(200).json({
    succes: true,
    login: true,
    token: user.getJsonWebToken(),
    users: user,

  });
});


exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 10;

  const sort = req.query.sort;

  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const start = (page - 1) * limit; // Corrected start calculation

  const pagination = await paginate(page, limit, User)


  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    throw new myError(req.params.id + " ID-тэй хэрэглэгч олдсонгүй.", 403);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});
exports.createUser = asyncHandler(async (req, res, next) => {
  console.log("data: ", req.body);

  const user = await User.create(req.body);

  res.status(200).json({
    succes: true,
    data: user,
  });
});
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new myError(req.params.id + " ID-тэй хэрэглэгч байхгүй", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new myError(req.params.id + " ID-тэй хэрэглэгч байхгүй байна", 400);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: user,
  });
});

