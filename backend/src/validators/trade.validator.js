const { z } = require('zod');

exports.createTradeSchema = z.object({
  title: z.string().trim().min(3, 'Title requires min 3 chars'),
  description: z.string().trim().max(500).optional(),
  profitLoss: z.number(),
  tradeType: z.enum(['buy', 'sell']),
  tradeDate: z.coerce.date()
}).strict();

exports.updateTradeSchema = z.object({
  title: z.string().trim().min(3).optional(),
  description: z.string().trim().max(500).optional(),
  profitLoss: z.number().optional(),
  tradeType: z.enum(['buy', 'sell']).optional(),
  tradeDate: z.coerce.date().optional()
}).strict();
