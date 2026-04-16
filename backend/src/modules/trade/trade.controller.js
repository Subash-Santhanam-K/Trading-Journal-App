const tradeService = require('./trade.service');
const asyncHandler = require('../../utils/asyncHandler');

exports.createTrade = asyncHandler(async (req, res, next) => {
  const trade = await tradeService.createTrade(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: 'Trade logged successfully',
    data: trade
  });
});

exports.getAllTrades = asyncHandler(async (req, res, next) => {
  const result = await tradeService.getAllTrades(req.user, req.query);
  res.status(200).json({
    success: true,
    message: 'Trades fetched successfully',
    data: result.data,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    }
  });
});

exports.getTradeById = asyncHandler(async (req, res, next) => {
  const trade = await tradeService.getTradeById(req.user, req.params.id);
  res.status(200).json({ success: true, message: 'Trade retrieved successfully', data: trade });
});

exports.updateTrade = asyncHandler(async (req, res, next) => {
  const trade = await tradeService.updateTrade(req.user, req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Trade updated successfully', data: trade });
});

exports.deleteTrade = asyncHandler(async (req, res, next) => {
  await tradeService.deleteTrade(req.user, req.params.id);
  res.status(200).json({ success: true, message: 'Trade deleted successfully' });
});

exports.getTradeStats = asyncHandler(async (req, res, next) => {
  const stats = await tradeService.getTradeStats(req.user);
  res.status(200).json({
    success: true,
    message: 'Stats retrieved successfully',
    data: stats
  });
});
