const User = require("../models/userModel");
const asyncWrapper = require("../utils/asyncWrapper");
const generateJWT = require("../utils/generateJWT");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcryptjs");

const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find(
    {},
    {
      __v: false,
      password: false,
    }
  );

  // If there was no users found
  if (!users) {
    return res
      .status(404)
      .json({ status: httpStatus.FAIL, message: "No users found" });
  }

  return res.status(200).json({ status: httpStatus.SUCCESS, data: { users } });
});

const getSingleUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id, { __v: false, password: false });

  if (!user) {
    return res
      .status(404)
      .json({ status: httpStatus.FAIL, message: "User not found" });
  }

  return res.status(200).json({ status: httpStatus.SUCCESS, data: { user } });
});

const registerUser = asyncWrapper(async (req, res) => {
  // Check if user exists
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).json({
      status: httpStatus.FAIL,
      message: "This email address is already registered",
    });
  }

  // Make sure its a strong password
  if (req.body.password.length < 3) {
    return res.status(400).json({
      status: httpStatus.FAIL,
      message: "Password must be more than 3 characters",
    });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Create User
  const newUser = new User({ ...req.body, password: hashedPassword });
  await newUser.save();

  const token = generateJWT({
    name: `${newUser.firstName} ${newUser.lastName}`,
    id: newUser._id,
    role: newUser.role,
  });

  return res.status(201).json({ status: httpStatus.SUCCESS, token });
});

const loginUser = asyncWrapper(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      status: httpStatus.FAIL,
      message: "This email address is not registered.",
    });
  }

  const isPasswordMatching = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatching) {
    return res.status(401).json({
      status: httpStatus.FAIL,
      message: "Wrong password",
    });
  }

  const token = generateJWT({
    name: `${user.firstName} ${user.lastName}`,
    id: user._id,
    role: user.role,
  });

  return res.status(200).json({ status: httpStatus.SUCCESS, token });
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res
      .status(404)
      .json({ status: httpStatus.FAIL, message: "User not found" });
  }

  return res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

const updateUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  // Check if email address already exists
  const doesEmailExist = await User.findOne({ email: req.body.email });
  if (doesEmailExist) {
    return res.status(400).json({
      status: httpStatus.FAIL,
      message: "This email address already exists",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      ...req.body,
    },
    { returnDocument: "after" }
  );

  return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data: { user: updatedUser } });
});

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  getSingleUser,
};
