import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

export const register = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;

  //basic validation
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // 2. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  // 3. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Create the new user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  // 2. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  // 3. Generate JWT
  const accessToken = generateAccessToken(user.id);

  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: "Login successful",
    accessToken: accessToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

export const refreshAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const accessToken = generateAccessToken(decoded.userId);

  res.status(200).json({
    accessToken,
  });
});

export const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });
  }

  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "Logged out",
  });
});

export const googleCallback = catchAsync(async (req, res) => {
  const user = req.user;

  const accessToken = generateAccessToken(user.id);

  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
sameSite:
  process.env.NODE_ENV === "production"
    ? "none"
    : "lax",
  });

  const redirectUrl = `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}&id=${user.id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;

  res.redirect(redirectUrl);
});
