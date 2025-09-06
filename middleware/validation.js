const { body, param } = require('express-validator');

// Product validation
const validateProduct = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('category').trim().isLength({ min: 1, max: 100 }).withMessage('Category is required and must be less than 100 characters'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('image_url').optional().isURL().withMessage('Invalid image URL'),
  body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
];

// Cart validation
const validateCartItem = [
  body('product_id').isInt({ min: 1 }).withMessage('Valid product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];

const validateCartUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Valid cart item ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];

// Order validation
const validateOrder = [
  body('shipping_address').trim().isLength({ min: 10, max: 500 }).withMessage('Shipping address is required and must be between 10-500 characters')
];

// ID parameter validation
const validateId = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID is required')
];

module.exports = {
  validateProduct,
  validateCartItem,
  validateCartUpdate,
  validateOrder,
  validateId
};