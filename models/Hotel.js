const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    price_per_night: { type: Number, required: true },
    available_rooms: { type: Number, required: true },
    description: { type: String, required: false },
    amenities: [{ type: String }],  // e.g., ["WiFi", "Swimming Pool", "Parking"]
    image_url: { type: String, required: false },  // URL to an image of the hotel
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, // Linking the hotel to the admin who created it (hotel manager)
  },
  { timestamps: true }
);

const Hotel = mongoose.model('Hotel', HotelSchema);
module.exports = Hotel;
