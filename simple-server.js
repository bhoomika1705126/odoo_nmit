require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'EcoFinds API is running' });
});

// Test if routes can be loaded
try {
  app.use('/api/products', require('./routes/products'));
  console.log('Products routes loaded successfully');
} catch (error) {
  console.error('Error loading products routes:', error.message);
}

try {
  app.use('/api/cart', require('./routes/cart'));
  console.log('Cart routes loaded successfully');
} catch (error) {
  console.error('Error loading cart routes:', error.message);
}

try {
  app.use('/api/orders', require('./routes/orders'));
  console.log('Orders routes loaded successfully');
} catch (error) {
  console.error('Error loading orders routes:', error.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});