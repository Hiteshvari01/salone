const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminSchema = new mongoose.Schema({
    adminName: { type: String, required: true, trim: true },
    yearsOfExperience: { type: Number, required: true, default: 0 },
    happyCustomers: { type: Number, required: true, default: 0 },
    contactPhone: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, unique: true },
    password: { type: String },  
    address: { type: String, required: true, trim: true },
    aboutUsText: { type: String, required: true, trim: true },
    discountOfferPercentage: { type: Number, default: 0 },
    discountOfferText: { type: String, trim: true },
    footerAboutText: { type: String, trim: true },
    profileImage: {                     
        url: String,
        filename: String
    },
}, { timestamps: true });

// Password hash before save
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Password check method
adminSchema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema, 'admins');
