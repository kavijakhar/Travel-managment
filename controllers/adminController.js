const nodemailer = require("nodemailer");
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching admins', error: err });
    }
};


const transporter = nodemailer.createTransport({
    host: "mail.antheminfotech.info",
    port: 587,
    secure: false,
    auth: {
        user: "hello@antheminfotech.info",
        pass: "Anthem@nh22",
    },
    tls: {
        ciphers: "TLSv1.2",
        rejectUnauthorized: false,
    },
});

const createAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!["hotel_manager", "travel_agent"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const currentAdmin = req.admin;
    if (currentAdmin.role !== "super_admin") {
        return res
            .status(403)
            .json({ message: "Access Denied, Only Super Admin can create an Admin" });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res
                .status(400)
                .json({ message: "Admin with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newAdmin.save();

        // Send email with login credentials using SMTP
        const mailOptions = {
            from: '"Your Company" <hello@antheminfotech.info>', // Replace with your verified sender email
            to: email,
            subject: "Your Admin Account Details",
            html: `
            <h3>Welcome, ${name}!</h3>
            <p>Your admin account has been created successfully.</p>
            <p><strong>Login URL:</strong> <a href="https://your-app.com/login">Login Here</a></p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p>Please change your password after logging in for security reasons.</p>
            <br/>
            <p>Best Regards,<br/>Your Company Name</p>
        `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email sending error:", error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res
            .status(201)
            .json({ message: "Admin created successfully. Email sent.", admin: newAdmin });
    } catch (err) {
        res.status(500).json({ message: "Error creating admin", error: err });
    }
};



const updateAdmin = async (req, res) => {
    const { adminId } = req.params;
    const { name, email, role } = req.body;
    // Validate required fields
    if (!name && !email && !role) {
        return res.status(400).json({ message: 'Please provide at least one field to update' });
    }

    // Check if the current user is a Super Admin
    const currentAdmin = req.admin;
    if (currentAdmin.role !== 'super_admin') {
        return res.status(403).json({ message: 'Access Denied, Only Super Admin can update an Admin' });
    }

    try {
        // Find the admin to be updated
        const adminToUpdate = await Admin.findById(adminId);
        if (!adminToUpdate) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Update the admin's details
        if (name) adminToUpdate.name = name;
        if (email) adminToUpdate.email = email;
        if (role) {
            if (role !== 'super_admin' && ['hotel_manager', 'travel_agent'].includes(role)) {
                adminToUpdate.role = role;
            } else {
                return res.status(400).json({ message: 'Invalid role or cannot assign super_admin role' });
            }
        }

        // Save the updated admin
        await adminToUpdate.save();

        res.status(200).json({ message: 'Admin updated successfully', admin: adminToUpdate });
    } catch (err) {
        res.status(500).json({ message: 'Error updating admin', error: err });
    }
};

const getAdminById = async (req, res) => {
    const { adminId } = req.params;

    try {
        // Find the admin by adminId
        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Return the admin data
        res.status(200).json({ admin });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving admin', error: err });
    }
};

const deleteAdmin = async (req, res) => {
    const { adminId } = req.params;

    try {
        // Check if the admin to be deleted exists
        const adminToDelete = await Admin.findById(adminId);
        if (!adminToDelete) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if the current user is a Super Admin
        const currentAdmin = req.admin;
        if (currentAdmin.role !== 'super_admin') {
            return res.status(403).json({ message: 'Access Denied, Only Super Admin can delete an Admin' });
        }

        // Delete the admin from the database
        await Admin.findByIdAndDelete(adminId);

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting admin', error: err });
    }
};


const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      // Normalize email to lowercase for case-insensitive matching
      const normalizedEmail = email.trim().toLowerCase();
  
      // Find the admin by normalized email
      const admin = await Admin.findOne({ email: normalizedEmail });
      
      console.log('Admin fetched:', admin); // Debugging the result
  
      // If admin not found
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Compare the password with the stored hash
      const isPasswordValid = await bcrypt.compare(password, admin.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const payload = { id: admin._id, email: admin.email, role: admin.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send the token to the client
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.log('Error during login:', err); // Log error
      res.status(500).json({ message: 'Error logging in', error: err.message });
    }
  };
  

module.exports = { getAllAdmins, createAdmin, updateAdmin, getAdminById, deleteAdmin, loginAdmin };