require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'EcoFinds API is running' });
});

// Test products route
app.get('/api/products', (req, res) => {
  res.json({ message: 'Products endpoint working', products: [] });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
});