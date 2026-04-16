const express = require('express');
const router = express.Router();
const userRoutes = require('../modules/user/user.routes');
const tradeRoutes = require('../modules/trade/trade.routes');
const tradeController = require('../modules/trade/trade.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const { tradeQuerySchema } = require('../validators/query.validator');

router.use('/auth', userRoutes);
router.use('/trades', tradeRoutes);

// Admin-only route mappings
router.get('/admin/trades', authMiddleware, authorizeRoles('admin'), validate(tradeQuerySchema, 'query'), tradeController.getAllTrades);

module.exports = router;
