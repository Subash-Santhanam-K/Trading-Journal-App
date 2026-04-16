const prisma = require('../../config/db');
const { hashPassword, comparePassword } = require('../../utils/hash');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const AppError = require('../../utils/AppError');

exports.registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new AppError('Email already exists', 400);
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user'
    }
  });

  const { password, refreshToken, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

exports.loginUser = async (data) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  const { password, refreshToken: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

exports.refreshToken = async (token) => {
  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!user || user.refreshToken !== token) {
    throw new AppError('Invalid refresh token', 401);
  }

  // 🔥 ROTATION
  const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user.id, role: user.role });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken }
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

exports.logout = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }
  });
  return true;
};
