const User = require("./../models/user");
// ...existing code...
const { generateToken } = require("../config/jwt");
const { successResponse, errorResponse } = require("../utils/response");

exports.signup = async (req, res, next) => {
  try {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json(errorResponse("Email already registered"));

  const user = await User.create({ name, email, password });
  // Password will be hashed by userSchema.pre('save')

  const token = generateToken(user);
  res.status(201).json(successResponse("User registered", { user, token }));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json(errorResponse("User not found"));

  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json(errorResponse("Invalid credentials"));

  const token = generateToken(user);
  res.json(successResponse("Login successful", { user, token }));
  } catch (error) {
    next(error);
  }
};
