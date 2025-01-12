const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const myError = require("../utils/myError");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new myError(
      "Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна. Та эхлээд логин хийнэ үү",
      401
    );
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    throw new myError("Токен байхгүй байна", 401);
  }
  //эхнийх нь шалгах гэж буй токен 2дахь нь нууц үг
  const tokenObj = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(tokenObj.id);

  next();
});
