const express = require("express");
const userRouter = require("./routes/userRoutes");
const morgan = require("morgan");
const globalErrorHandling = require("./controllers/errorController");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// ROUTS
app.use("/users", userRouter);

// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     status: "error",
//     message: err || "Something went wrong",
//   });
// });

app.use(globalErrorHandling);

module.exports = app;
