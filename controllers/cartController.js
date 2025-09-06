const { pool } = require('../models/database');
const { validationResult } = require('express-validator');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(`
      SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [userId]);

    const total = result.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({ items: result.rows, total: total.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Check if product exists and has stock
    const productResult = await pool.query('SELECT stock_quantity FROM products WHERE id = $1', [product_id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (productResult.rows[0].stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already in cart
    const existingItem = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2', [userId, product_id]);

    if (existingItem.rows.length > 0) {
      // Update quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      if (newQuantity > productResult.rows[0].stock_quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      const result = await pool.query(
        'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [newQuantity, userId, product_id]
      );
      res.json(result.rows[0]);
    } else {
      // Add new item
      const result = await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, product_id, quantity]
      );
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Check stock availability
    const stockCheck = await pool.query(`
      SELECT p.stock_quantity 
      FROM cart c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.id = $1 AND c.user_id = $2
    `, [id, userId]);

    if (stockCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity > stockCheck.rows[0].stock_quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const result = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, id, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};