const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema, 'reviews');
