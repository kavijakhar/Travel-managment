const express = require('express');
const router = express.Router();

// Define your route handlers
router.post('/login', (req, res) => {
  res.send('Login route');
});

// Export the router instance
module.exports = router;
