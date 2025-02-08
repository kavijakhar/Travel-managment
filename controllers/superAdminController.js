const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if Super Admin exists
    const superAdmin = await User.findOne({ email, role: "super_admin" });

    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
