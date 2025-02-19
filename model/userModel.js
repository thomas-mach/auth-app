const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
    },
    email: {
      type: String,
      required: [true, "The email is required"],
      unique: true,
      trim: true,
      maxlength: [255, "Email is too long"],
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "The password is required"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "The password is required"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },

        message: "The passwords are not the same",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.userCreatedAt = Date.now() - 1000;
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
