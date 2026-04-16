const userService = require('./user.service');
const asyncHandler = require('../../utils/asyncHandler');

exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await userService.registerUser(req.body);
  res.status(201).json({
    success: true,
    data: user
  });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const result = await userService.loginUser(req.body);
  res.status(200).json({ success: true, message: 'Login successful', data: result });
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const result = await userService.refreshToken(req.body.refreshToken);
  res.status(200).json({ success: true, message: 'Token refreshed', data: result });
});

exports.logout = asyncHandler(async (req, res, next) => {
  await userService.logout(req.user.id);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
