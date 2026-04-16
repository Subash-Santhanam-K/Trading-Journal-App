const { z } = require('zod');

exports.registerSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(6).max(20),
  role: z.enum(['user', 'admin']).optional()
}).strict();

exports.loginSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
}).strict();

exports.refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
}).strict();
