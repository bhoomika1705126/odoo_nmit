const { pool } = require('../models/database');
const { validationResult } = require('express-validator');

// Get all products with search and filtering
const getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json({ products: result.rows, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create product
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, category, condition, image_url, stock_quantity } = req.body;
    const seller_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO products (name, description, price, category, condition, image_url, seller_id, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description, price, category, condition, image_url, seller_id, stock_quantity || 1]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, description, price, category, condition, image_url, stock_quantity } = req.body;

    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, category = $4, condition = $5, image_url = $6, stock_quantity = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 AND seller_id = $9 RETURNING *',
      [name, description, price, category, condition, image_url, stock_quantity, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 AND seller_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};