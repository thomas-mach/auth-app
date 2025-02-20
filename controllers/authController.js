const crypto = require("crypto");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const { promisify } = require("util");
const ms = require("ms");

const signToken = (id, duration) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: duration,
  });

const createSendToken = (user, status, res, duration) => {
  const token = signToken(user._id, duration);
  const cookieOtions = {
    expires: new Date(Date.now() + ms(duration)),
    secure: true,
    httpOnly: true,
    // sameSite: "strict",
  };
  res.cookie("jwt", token, cookieOtions);
  user.password = undefined;
  res.status(status).json({
    status: "success",
    data: {
      user,
    },
    // token: token
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (!existingUser.isActive) {
      existingUser.isActive = true;
      existingUser.isVerified = false;
      existingUser.password = password;
      existingUser.passwordConfirm = passwordConfirm;
      existingUser.name = name;
      await existingUser.save({ validateBeforeSave: false });

      // Invia la conferma email per riattivazione
      const verificationToken = signToken(existingUser._id, "1h");
      const verificationUrl = `${req.protocol}://${req.get(
        "host"
      )}/v1/auth/verify?token=${verificationToken}`;

      await sendEmail({
        email: existingUser.email,
        subject: "Confirm the reactivation of your account.",
        message: `Click here to reactivate your account. ${verificationUrl}`,
      });

      return res.status(200).json({
        status: "success",
        message:
          "Your account has been reactivated! Check your email to confirm.",
      });
    }

    // Se l'utente esiste ed è attivo, blocca la registrazione
    return next(new AppError("Email already in use!", 400));
  }

  // Crea utente con stato "non verificato"
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    isVerified: false,
  });

  // Genera un token di verifica (es. 1h di validita)
  const verificationToken = signToken(newUser._id, "1h");

  // Crea il link di verifica
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/v1/auth/verify?token=${verificationToken}`;

  // Invia l'email di conferma
  try {
    await sendEmail({
      email: newUser.email,
      subject: "Verifica your email",
      message: verificationUrl,
    });

    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (err) {
    await User.findByIdAndDelete(newUser._id);
    return next(
      new AppError("There was an error sending emial try again later!"),
      500
    );
  }
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new AppError("Token mancante", 400));
  }

  // Verifica token
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Token non valido o scaduto", 400));
  }
  // Trova l'utente
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("Utente non trovato", 400));
  }

  if (user.isVerified) {
    return next(new AppError("Email già verificata!", 400));
  }

  // Aggiotna lo stato di verifica
  user.isVerified = true;
  user.isActive = true;
  user.deactivatedAt = null;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Email verificata con successo! Ora puoi effettuare il login.",
    data: user,
  });
  // .redirect(`${process.env.FRONTEND_URL}/login`);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return next(new AppError("Please provaid email and password"), 400);
  }

  const user = await User.findOne({ email, isVerified: true }).select(
    "+password"
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorect email or password", 401));
  }

  user.lastLogin = Date.now();

  await user.save({ validateBeforeSave: false });
  createSendToken(user, 201, res);
});

exports.logout = (req, res) => {
  res
    .status(200)
    .cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .json({ status: "success", message: "Logout eseguito con successo!" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log("TOKEN FROM REQ.COOKI.JWT", token);
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Devi essere loggato per accedere!", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("DECODED", decoded);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    return next(
      new AppError("L'utente non esiste o è stato disattivato!", 401)
    );
  }

  // Chcek if user changed the password after the token was issued.
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("The password was recently changed please log in again", 401)
    );
  }

  req.user = user;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email adress", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid 10 mins)`,
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined);
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending emial try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is expired or invalid", 404));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from colection
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your curren password is wrong", 401));
  }

  // if (user.correctPassword(req.body.passwordConfirm, user.password)) {
  //   return next(
  //     new AppError("Your new password must be defrent then old password")
  //   );
  // }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
  // const token = signToken(user._id);

  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});
