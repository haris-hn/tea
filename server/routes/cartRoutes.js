const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItemQuantity } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .put(protect, updateCartItemQuantity);

router.route('/:variantId')
  .delete(protect, removeFromCart);

module.exports = router;
