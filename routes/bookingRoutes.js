const express = require('express');
const router = express.Router();

// Define your route handlers
router.get('/', (req, res) => {
  res.send('Booking route');
});

// Additional booking-specific routes
router.post('/create', (req, res) => {
  res.send('Booking create route');
});

// Export the router instance
module.exports = router;
