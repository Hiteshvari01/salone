const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const wrapAsync = require('../utils/wrapAsync');
const bcrypt = require('bcrypt');
const { isNotLoggedIn } = require('../middleware');

// --- Login Page ---
router.get('/login', isNotLoggedIn, (req, res) => {
  // Prevent redirect loop if already logged in
  if (req.session.adminId) return res.redirect('/admin/dashboard');
  console.log("admin not found",req.session);
  res.render('admin/login/login', { error: null, layout: false });
});

// --- Login POST ---
router.post(
  '/login',
  wrapAsync(async (req, res) => {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password?.trim();

    if (!email || !password) {
      req.flash('error', 'Please fill all fields');
      return res.redirect('/admin/login');
    }

    const admin = await Admin.findOne({ contactEmail: email });
    if (!admin || !admin.password) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/admin/login');
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/admin/login');
    }

    req.session.adminId = admin._id;
    req.flash('success', 'Logged in successfully!');
    return res.redirect('/admin/dashboard');
  })
);


// --- Forgot Password Page ---
router.get('/forgot-password', isNotLoggedIn, (req, res) => {
  res.render('admin/login/forgetPass', { message: null, error: null, layout: false });
});

// --- Handle Forgot Password POST ---
router.post(
  '/forgot-password',
  wrapAsync(async (req, res) => {
    const email = req.body.email?.toLowerCase().trim();
    const admin = await Admin.findOne({ contactEmail: email });

    if (!admin) {
      return res.render('admin/login/forgetPass', { message: null, error: 'Email not found', layout: false });
    }

    res.render('admin/login/reset', { adminId: admin._id, error: null, layout: false });
  })
);

// --- Handle Reset Password POST ---
router.post(
  '/reset-password',
  wrapAsync(async (req, res) => {
    const { adminId, newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.render('admin/login/reset', { adminId, error: 'Please fill all fields', layout: false });
    }

    if (newPassword !== confirmPassword) {
      return res.render('admin/login/reset', { adminId, error: 'Passwords do not match', layout: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await Admin.findByIdAndUpdate(adminId, { password: hashedPassword });

    return res.redirect('/admin/login');
  })
);

// --- Logout ---
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.redirect('/admin/dashboard');
    }
    res.clearCookie('connect.sid', { path: '/' });
    return res.redirect('/admin/login');
  });
});

module.exports = router;
