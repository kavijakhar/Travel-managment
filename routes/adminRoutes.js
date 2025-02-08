const express = require('express');
const router = express.Router();

// Define your route handlers
router.get('/', (req, res) => {
  res.send('Admin route');
});

// Additional admin-specific routes
router.post('/create', (req, res) => {
  res.send('Admin create route');
});

// Export the router instance
module.exports = router;
