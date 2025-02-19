const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    data: {
      users: users,
    },
    status: "success",
    message: "Get all users rout",
  });
});
