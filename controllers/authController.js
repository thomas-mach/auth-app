const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

const createSendToken = (user, status, res) => {
  const token = signToken(user._id);
  const cookieOtions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
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
      // Riattiva l'account
      existingUser.isActive = true;
      existingUser.isVerified = false; // Potresti richiedere una nuova verifica
      existingUser.password = password;
      existingUser.passwordConfirm = passwordConfirm;
      await existingUser.save({ validateBeforeSave: false });

      // Invia la conferma email per riattivazione
      const verificationToken = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      const verificationUrl = `${req.protocol}://${req.get(
        "host"
      )}/users/auth?token=${verificationToken}`;

      await sendEmail({
        email: existingUser.email,
        subject: "Conferma la riattivazione del tuo account",
        message: `Clicca qui per riattivare il tuo account: ${verificationUrl}`,
      });

      return res.status(200).json({
        status: "success",
        message:
          "Il tuo account è stato riattivato! Controlla l'email per confermare.",
      });
    }

    // Se l'utente esiste ed è attivo, blocca la registrazione
    return next(new AppError("Email già in uso!", 400));
  }

  // Crea utente con stato "non verificato"
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    isVerified: false,
  });

  // Genera un token di verifica (es. 24h di validita)
  const verificationToken = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  // Crea il link di verifica
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/users/auth?token=${verificationToken}`;

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
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Devi essere loggato per accedere!", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    return next(
      new AppError("L'utente non esiste o è stato disattivato!", 401)
    );
  }

  req.user = user;
  next();
});

exports.softDeleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id, //viene preso dal middleware di autenticazione
    { isActive: false },
    { new: true }
  );

  if (!user) {
    next(new AppError("Utente non trovato", 404));
  }

  // Disconnetti l'utente cancellando il cookie JWT
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Il tuo account è stato disattivato con successo!",
  });
});
