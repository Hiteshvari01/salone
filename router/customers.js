const express = require("express");
const Customer = require('../models/customer');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

router.get('/', wrapAsync(async (req, res) => {
    const customers = await Customer.find(); // Get all customers
    const total = customers.length;
    res.render('admin/customers/all', {
        customers,stats: { total } 
    });
}));

module.exports = router;
