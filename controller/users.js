const User = require("../models/User");
const myError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require('../utils/paginate')


// register
exports.register = asyncHandler(async (req, res, next) => {

  const user = await User.create(req.body)

  res.status(200).json({
    succes: true,
    users: req.body
  });
});

