const express = require('express');
const Services = require('../models/service');
const Customer = require('../models/customer');
const Booking = require('../models/booking');
const staff = require('../models/staff');
const GalleryImage = require("../models/gallery");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const services = await Services.find();
        const customers = await Customer.find();
        const staffList = await staff.find();
        const images = await GalleryImage.find();
        const bookings = await Booking.find()
            .populate('customer')
            .populate('serviceId')
            .sort({ date: -1, time: 1 });

        res.render('admin/dashboard/dashboard', {
            services,
            customers,
            staffList,
            bookings,
            images
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('admin/error', { message: 'Server Error' });
    }
});

module.exports = router;
