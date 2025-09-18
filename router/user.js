const Admin = require('../models/admin');
const Services = require('../models/service');
const Booking = require('../models/booking');
const Customer = require('../models/customer');
const GalleryImage = require('../models/gallery');
const Staff = require('../models/staff');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');

// ----------------------
// Nodemailer Setup
// ----------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.get('/', wrapAsync(async (req, res) => {
    const adminData = await Admin.findOne();
    const services = await Services.find();
    const bookings = await Booking.find();
    const customers = await Customer.find();
    const galleryImages = await GalleryImage.find();
    const staffData = await Staff.find();
    res.render('salone/home', { adminData, services, bookings, customers, galleryImages, staffData });
}));

router.get('/about', wrapAsync(async (req, res) => {
    const adminData = await Admin.findOne();
    const staffData = await Staff.find();
    res.render('salone/about', { adminData, staffData });
}));

router.get('/price', wrapAsync(async (req, res) => {
    const services = await Services.find();
    const adminData = await Admin.findOne();
    res.render('salone/price', { services, adminData });
}));

router.get('/service', wrapAsync(async (req, res) => {
    const services = await Services.find();
    res.render('salone/services', { services });
}));

router.get('/contact', wrapAsync(async (req, res) => {
    const success = req.flash("success"); // ✅ Flash message get karna
    res.render('salone/contact', { success: success[0] }); // Pass first message
}));

router.post("/save-contact", wrapAsync(async (req, res) => {
    const { name, email, subject, message } = req.body;

    const newContact = new User({ name, email, subject, message });
    await newContact.save();

    const admins = await Admin.find();
    const adminEmails = admins.map(admin => admin.contactEmail);

    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Request Has Been Submitted',
        html: `<div>Thank you, ${name}, for contacting us. We will get back to you soon!</div>`
    };

    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmails.join(','),
        subject: 'New Contact Form Submission',
        html: `<div>New message from ${name} (${email}):<br>${message}</div>`
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: 'Message sent successfully!' }); // ✅ JSON response for AJAX
}));

router.get('/gallery', wrapAsync(async (req, res) => {
    const galleryImages = await GalleryImage.find();
    res.render('salone/gallery', { galleryImages });
}));

router.get('/team', wrapAsync(async (req, res) => {
    const staffData = await Staff.find();
    res.render('salone/team', { staffData });
}));
module.exports = router;