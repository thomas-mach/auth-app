exports.getAllUsers = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Get all users rout",
  });
};
