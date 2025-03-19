const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'hotel_manager', 'travel_agent'],
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
