const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("../models/Admin"); // Use Admin model here

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📡 MongoDB Connected");

    // Ensure a Super Admin exists
    await createSuperAdmin();
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1); 
  }
};

// Function to create Super Admin if not exists
const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await Admin.findOne({ role: "super_admin" });
    if (existingSuperAdmin) {
      console.log("✅ Super Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);

    const superAdmin = new Admin({
      name: "Super Admin",
      email: process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com",
      password: hashedPassword,
      role: "super_admin",
    });

    await superAdmin.save();
    console.log("🎉 Super Admin created successfully!");
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error);
  }
};

module.exports = connectDB;
