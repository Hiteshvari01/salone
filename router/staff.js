const express = require('express');
const router = express.Router();
const Staff = require('../models/staff.js');
const { validateStaff } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');
const methodOverride = require('method-override');
const multer = require('multer');
const { storage } = require('../config.js'); // Cloudinary storage
const upload = multer({ storage });
const cloudinary = require('cloudinary').v2;

router.use(methodOverride('_method'));

// -------- GET All Staff --------
router.get('/', wrapAsync(async (req, res) => {
    const staffList = await Staff.find();
    const totalStaff = staffList.length;
    res.render('admin/staff/all', { staffList, totalStaff });
}));

// -------- New Staff Form --------
router.get('/add', (req, res) => {
    res.render('admin/staff/new');
});

// -------- Create Staff --------
router.post('/add', upload.single('image'), wrapAsync(async (req, res) => {
    const { name, specialization } = req.body;
    const staffData = { name, specialization };

    if (req.file) {
        staffData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    } else {
        req.flash("error", "Image is required");
        return res.redirect('/admin/staff/add');
    }

    await Staff.create(staffData);
    req.flash("success", "Staff member added successfully!");
    res.redirect('/admin/staff');
}));

// -------- Edit Staff Form --------
router.get('/edit/:id', wrapAsync(async (req, res) => {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
        req.flash("error", "Staff not found");
        return res.redirect('/admin/staff');
    }
    res.render('admin/staff/edit', { staff });
}));

// -------- Update Staff --------
router.put("/edit/:id", upload.single("image"), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { name, specialization } = req.body;
    const staff = await Staff.findById(id);

    if (!staff) {
        req.flash("error", "Staff not found");
        return res.redirect('/admin/staff');
    }

    staff.name = name;
    staff.specialization = specialization;

    if (req.file) {
        if (staff.image?.filename) {
            await cloudinary.uploader.destroy(staff.image.filename);
        }
        staff.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await staff.save();
    req.flash("success", "Staff member updated successfully!");
    res.redirect("/admin/staff");
}));

// -------- Delete Staff --------
// -------- Delete Staff --------
router.post('/delete/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const staff = await Staff.findById(id);
    if (!staff) {
        req.flash("error", "Staff not found");
        return res.redirect('/admin/staff');
    }

    // Delete image from Cloudinary if exists
    if (staff.image?.filename) {
        await cloudinary.uploader.destroy(staff.image.filename);
    }

    await Staff.findByIdAndDelete(id);
    req.flash("success", "Staff member deleted successfully!");
    res.redirect('/admin/staff');
}));

module.exports = router;
