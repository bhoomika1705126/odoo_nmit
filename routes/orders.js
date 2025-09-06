const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateOrder, validateId } = require('../middleware/validation');
const {
  createOrder,
  getOrders,
  getOrder
} = require('../controllers/orderController');

// All order routes require authentication
router.use(authenticateToken);

router.post('/', validateOrder, createOrder);
router.get('/', getOrders);
router.get('/:id', validateId, getOrder);

module.exports = router;