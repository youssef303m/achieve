const httpStatus = require("../utils/httpStatus");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const updateUserValidation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ status: httpStatus.FAIL, message: "User not found" });
    }

    // Email Validation
    if (req.body.email) {
      // Validate email address
      const isValidEmail = validator.isEmail(req.body.email);
      if (!isValidEmail) {
        return res.status(400).json({
          status: httpStatus.FAIL,
          message: "Invalid email address",
        });
      }
      // Compare new email with old email
      if (req.body.email && req.body.email === user.email) {
        return res.status(400).json({
          status: httpStatus.FAIL,
          message: "New email address cannot be the same as old one",
        });
      }
    }

    // Password validation
    if (req.body.password) {
      // Validate password length
      if (req.body.password.length < 3) {
        return res.status(400).json({
          status: httpStatus.FAIL,
          message: "Password must be at least 3 characters",
        });
      }
      // Compare new password with old password
      if (req.body.password) {
        const isSamePassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (isSamePassword) {
          return res.status(400).json({
            status: httpStatus.FAIL,
            message: "New password cannot be the same as old one",
          });
        }
      }
      // Hash new password
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // If everything is ok
    next();
  } catch (err) {
    return res.status(500).json({
      status: httpStatus.ERROR,
      message: "An error occurred validating user information",
    });
  }
};

module.exports = {
  updateUserValidation,
};
