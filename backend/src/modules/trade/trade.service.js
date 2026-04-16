const prisma = require('../../config/db');
const AppError = require('../../utils/AppError');

exports.createTrade = async (userId, data) => {
  return prisma.task.create({
    data: {
      ...data,
      userId
    }
  });
};

exports.getAllTrades = async (user, filters) => {
  const page = Number(filters?.page) || 1;
  const limit = Number(filters?.limit) || 10;
  const type = filters?.type;
  const minProfit = filters?.minProfit !== undefined && filters.minProfit !== null ? Number(filters.minProfit) : undefined;
  const maxProfit = filters?.maxProfit !== undefined && filters.maxProfit !== null ? Number(filters.maxProfit) : undefined;
  
  const allowedSortFields = ['createdAt', 'tradeDate', 'profitLoss'];
  const safeSortBy = allowedSortFields.includes(filters?.sortBy) ? filters.sortBy : 'createdAt';
  const safeOrder = filters?.order === 'asc' ? 'asc' : 'desc';

  const skip = (page - 1) * limit;

  const where = {};
  if (user.role !== 'admin') {
    where.userId = user.id;
  }

  if (type) {
    where.tradeType = type;
  }

  if (minProfit !== undefined || maxProfit !== undefined) {
    where.profitLoss = {};
    if (minProfit !== undefined) where.profitLoss.gte = minProfit;
    if (maxProfit !== undefined) where.profitLoss.lte = maxProfit;
  }

  try {
    const [total, data] = await prisma.$transaction([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: safeOrder },
        select: {
          id: true,
          title: true,
          description: true,
          profitLoss: true,
          tradeType: true,
          tradeDate: true,
          createdAt: true,
        }
      })
    ]);

    return { total, data, page, limit };
  } catch (error) {
    console.error('getAllTrades Prisma error:', error);
    throw error;
  }
};

exports.getTradeById = async (user, tradeId) => {
  const trade = await prisma.task.findUnique({
    where: { id: tradeId }
  });
  if (!trade) throw new AppError('Trade not found', 404);
  
  if (user.role !== 'admin' && trade.userId !== user.id) {
    throw new AppError('Forbidden', 403);
  }
  return trade;
};

exports.updateTrade = async (user, tradeId, data) => {
  const trade = await prisma.task.findUnique({
    where: { id: tradeId }
  });
  if (!trade) throw new AppError('Trade not found', 404);
  
  if (user.role !== 'admin' && trade.userId !== user.id) {
    throw new AppError('Forbidden', 403);
  }
  
  return prisma.task.update({
    where: { id: tradeId },
    data
  });
};

exports.deleteTrade = async (user, tradeId) => {
  const trade = await prisma.task.findUnique({
    where: { id: tradeId }
  });
  if (!trade) throw new AppError('Trade not found', 404);
  
  if (user.role !== 'admin' && trade.userId !== user.id) {
    throw new AppError('Forbidden', 403);
  }
  
  await prisma.task.delete({
    where: { id: tradeId }
  });
  return true;
};

exports.getTradeStats = async (user) => {
  const whereClause = user.role === 'admin' ? {} : { userId: String(user.id) };
  
  const trades = await prisma.task.findMany({
    where: whereClause,
    select: { profitLoss: true, userId: true }
  });

  let totalTrades = 0;
  let totalProfit = 0;
  let totalLoss = 0;
  let netProfit = 0;

  for (const trade of trades) {
    const pnl = Number(trade.profitLoss) || 0;

    totalTrades++;
    if (pnl > 0) {
      totalProfit += pnl;
    } else if (pnl < 0) {
      totalLoss += pnl;
    }
    netProfit += pnl;
  }

  return {
    totalTrades,
    totalProfit,
    totalLoss,
    netProfit
  };
};
