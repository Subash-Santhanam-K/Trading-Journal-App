const rateLimit = require('express-rate-limit');

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max requests per IP
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20, // stricter for auth routes
  message: {
    success: false,
    message: 'Too many login attempts, try again later.'
  }
});
