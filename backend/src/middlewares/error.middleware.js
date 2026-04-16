const { ZodError } = require('zod');

module.exports = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = undefined;

  // Handle specific known errors safely
  if (err instanceof ZodError || err.name === 'ZodError') {
    statusCode = 400;
    message = "Validation error";
    errors = err.errors;
  } else if (err.code && err.code.startsWith('P')) {
    // Prisma errors
    statusCode = 400;
    message = "Database error";
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  const response = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = err.message;
  }

  if (errors) {
    response.errors = errors;
  }

  // Ensure generic message for 500
  if (statusCode === 500 && !err.isOperational) {
    response.message = 'Internal Server Error';
  }

  res.status(statusCode).json(response);
};
