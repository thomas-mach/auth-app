const express = require("express");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const morgan = require("morgan");
const globalErrorHandling = require("./controllers/errorController");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
require("./jobs/deleteOldUsers");

const app = express();

app.use(helmet());
//contro atacchi basati sul headers Cross-Site Scripting (XSS)
// Clickjacking
// Attacchi di sniffing MIME
// Injection di codice
// Altri attacchi basati sugli header HTTP

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Registrazione delle rotte principali
app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);

app.use(globalErrorHandling);

module.exports = app;
