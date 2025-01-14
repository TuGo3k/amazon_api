const User = require("../models/User");
const myError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
// register
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getJsonWebToken();

  res.status(200).json({
    succes: true,
    token,
    users: user,
  });
});
//login хийнэ
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Оролтыг шалгана

  if (!email || !password) {
    throw myError("Имэйл болон нууц үгээ дамжуулна уу", 400);
  }

  // Тухайн хэрэглэгчийн хайна
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new myError("Имэйл болон нууц үгээ зөв оруулна уу", 401);
  }

  const ok = await user.checkPassword(password);

  if (!ok) {
    throw new myError("Имэйл болон нууц үгээ зөв оруулна уу", 400);
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

  const pagination = await paginate(page, limit, User);

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
  const user = await User.findById(req.params.id);

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

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    throw new myError("Та нууц үг сэргээх имэйл хаягаа дамжуулна уу", 400);
  }
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new myError(req.body.email + " имэйлтэй хэрэглэгч олдсонгүй.", 400);
  }

  const resetToken = user.generatePasswordChangeToken();
  await user.save();

  // await user.save({ validateBeforeSave: false})

  // Имэйл илгээнэ ээ
  const link = `https://amazon.mn/changepassword/${resetToken}`;
  const message = `Сайн байна уу<br><br>Та нууц үгээ солих хүсэлт илгээлээ. Доорх линк дээр дарж солино уу<br><br><a target="blanks" href="${link}">${link}</a><br><br>Өдрийг сайхан өнгөрүүлээрэй`;

  const info = await sendEmail({
    email: user.email,
    subject: "Нууц үг өөрчлөх хүсэлт",
    message,
  });

  console.log("Message sent: %s", info.messageId);

  res.status(200).json({
    success: true,
    resetToken,
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.resetToken || !req.body.password) {
    throw new myError("Та токен болон нууц үгээ дамжуулна уу", 400);
  }

  const encrypted = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: encrypted,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new myError(" Токен хүчингүй байна.", 400);
  }

  user.password = req.body.password;
  user.resetPassword = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = user.getJsonWebToken();

  res.status(200).json({
    succes: true,
    token,
    users: user,
  });
});
