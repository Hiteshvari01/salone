const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    image: {
        url: { type: String, required: true },
        filename: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema, 'staffs');
