const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/stats', protect, authorize('admin'), getOrderStats);
router.get('/:id', protect, getOrder);
router.put('/:id', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
