const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email and role "super_admin"
    const superAdmin = await Admin.findOne({ email, role: "super_admin" });

    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found!" });
    }
    async function hashPassword() {
      const password = "securePassword123";  // Use the password you want to test
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed Password:", hashedPassword);
    }
    
    hashPassword();
    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    console.log(isMatch)

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
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
