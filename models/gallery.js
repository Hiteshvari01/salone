const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { 
        url :String,
        filename:String,
     }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema, 'galleries');
