const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateCartItem, validateCartUpdate } = require('../middleware/validation');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(authenticateToken);

router.get('/', getCart);
router.post('/', validateCartItem, addToCart);
router.put('/:id', validateCartUpdate, updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

module.exports = router;