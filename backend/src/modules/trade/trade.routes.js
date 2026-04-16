const express = require('express');
const router = express.Router();
const tradeController = require('./trade.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const { createTradeSchema, updateTradeSchema } = require('../../validators/trade.validator');
const { tradeQuerySchema } = require('../../validators/query.validator');

router.use(authMiddleware);

router.get('/stats', tradeController.getTradeStats);
router.post('/', validate(createTradeSchema, 'body'), tradeController.createTrade);
router.get('/', validate(tradeQuerySchema, 'query'), tradeController.getAllTrades);
router.get('/:id', tradeController.getTradeById);
router.put('/:id', validate(updateTradeSchema, 'body'), tradeController.updateTrade);
router.delete('/:id', tradeController.deleteTrade);

module.exports = router;
