const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email Address is required"],
    unique: true,
    validate: [validator.isEmail, "Invalid Email Address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  avatar: {
    type: String,
    required: false,
  },
  minsFocused: {
    type: Number,
    default: 0,
  },
  motivationTexts: {
    type: Array,
    required: false,
  },
  role: {
    type: String,
    enum: [userRoles.USER, userRoles.ADMIN],
    default: userRoles.USER,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
