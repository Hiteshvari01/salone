const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: {
    url: String,
    filename: String
},
    price: { type: Number, required: true },
    duration: { type: String, default: '30 min' },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema, 'services');
