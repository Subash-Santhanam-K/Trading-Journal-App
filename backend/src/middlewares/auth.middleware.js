const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/db');
const AppError = require('../utils/AppError');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Unauthorized: No token provided', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new AppError('Unauthorized: Invalid or expired token', 401));
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return next(new AppError('Unauthorized: User not found', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
