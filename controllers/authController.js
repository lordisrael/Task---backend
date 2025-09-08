const User = require("./../models/user");
const asyncHandler = require('express-async-handler')
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
  const refreshToken = await createRefreshJWT(user._id);
  await User.findByIdAndUpdate(
    user._id,
    { refreshToken: refreshToken },
    { new: true }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000
  });
  res.json(successResponse("Login successful", { user, token }));
  } catch (error) {
    next(error);
  }
};

exports.logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if(!cookie.refreshToken) throw new UnauthenticatedError('No refresh token found')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if(!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        })
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: ""
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    return res.sendStatus(204)

})
