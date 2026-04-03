const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, getDashboardStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);

router.route('/')
  .post(protect, placeOrder)
  .get(protect, admin, getAllOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router;
