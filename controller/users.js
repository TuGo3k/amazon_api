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

