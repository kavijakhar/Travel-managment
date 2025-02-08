const express = require('express');
const router = express.Router();

// Define your route handlers
router.get('/', (req, res) => {
  res.send('Hotel route');
});

// Export the router instance
module.exports = router;
