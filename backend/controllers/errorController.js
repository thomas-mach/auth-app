const AppError = require("../utils/appError");

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate fields value ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    // message: err.messsage,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      isOperational: err.isOperational,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went rong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign({}, err);
    console.log("Error Name:", err.name);
    //   if (err.name === "CastError") error = hendleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    //   if (err.name === "JsonWebTokenError") error = handleJWTError();
    //   if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
