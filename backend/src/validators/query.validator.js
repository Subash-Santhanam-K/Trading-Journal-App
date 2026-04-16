const { z } = require('zod');

exports.tradeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  type: z.enum(['buy', 'sell']).optional(),
  minProfit: z.coerce.number().optional(),
  maxProfit: z.coerce.number().optional(),
  sortBy: z.enum(['tradeDate', 'profitLoss', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
}).strict().refine(data => {
  if (data.minProfit !== undefined && data.maxProfit !== undefined) {
    return data.minProfit <= data.maxProfit;
  }
  return true;
}, {
  message: "minProfit cannot be greater than maxProfit",
  path: ["minProfit"]
});
