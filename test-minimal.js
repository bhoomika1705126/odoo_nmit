const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is working' });
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
});