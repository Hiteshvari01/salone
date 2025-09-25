const express = require('express'); 
const Services = require('../models/service');
const Booking = require('../models/booking');
const wrapAsync = require('../utils/wrapAsync');
const { validateBooking } = require('../middleware.js'); 
const Customer = require('../models/customer');

const router = express.Router();

// -------- Redirect to all bookings --------
router.get('/', (req, res) => 
    res.redirect('/admin/booking/all')
);

// -------- All Bookings --------
router.get('/all', wrapAsync(async (req, res) => {
    const bookings = await Booking.find()
        .populate('customer')
        .populate('serviceId')
        .sort({ date: -1, time: 1 });
    
    res.render('admin/booking/all', { 
        bookings, 
        success: req.flash('success'), 
        error: req.flash('error') 
    });
}));

// -------- New Booking Form --------
router.get('/new', wrapAsync(async (req, res) => {
    const services = await Services.find({}, "name");
    res.render('admin/booking/new', { 
        old: {}, 
        services,
        success: req.flash('success'),
        error: req.flash('error')
    });
}));

// -------- Create Booking --------
router.post('/submit', wrapAsync(async (req, res) => {
    try {
        // extract customer object
        const { customer, serviceId, date, time, notes } = req.body;

        // find or create customer
        let existingCustomer = await Customer.findOne({ email: customer.email });
        if (!existingCustomer) {
            existingCustomer = await Customer.create(customer);
        }

        // now construct booking input
        const bookingData = {
            customer: existingCustomer._id,   // ✅ ObjectId now
            serviceId,
            date,
            time,
            notes
        };

        // validateBooking should check this bookingData, not raw req.body
        const newBooking = new Booking(bookingData);
        await newBooking.validate(); // manual validation

        await newBooking.save();

        req.flash('success', 'Booking created successfully!');
        res.redirect('/admin/booking/all');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to create booking. Please try again.');
        res.redirect('/admin/booking/new');
    }
}));

module.exports = router;
