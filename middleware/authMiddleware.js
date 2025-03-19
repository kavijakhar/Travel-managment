// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const verifySuperAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Access Denied, Token Required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access Denied, Not a Super Admin' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token', error: err });
  }
};

module.exports = { verifySuperAdmin };
