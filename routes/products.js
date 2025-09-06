const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateProduct, validateId } = require('../middleware/validation');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', validateId, getProduct);

// Protected routes
router.post('/', authenticateToken, validateProduct, createProduct);
router.put('/:id', authenticateToken, validateId, validateProduct, updateProduct);
router.delete('/:id', authenticateToken, validateId, deleteProduct);

module.exports = router;