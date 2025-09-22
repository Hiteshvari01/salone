const express = require("express"); 
const router = express.Router();
const Services = require("../models/service");
const { validateService } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const methodOverride = require("method-override");
const multer = require("multer");
const { storage } = require("../config.js");
const upload = multer({ storage });
const cloudinary = require("cloudinary").v2;

router.use(methodOverride("_method"));

// -------- GET All Services --------
router.get("/", wrapAsync(async (req, res) => {
    const services = await Services.find().sort({ createdAt: -1 });
    res.render("admin/service/all", { services });
}));

// -------- New Service Form --------
router.get("/add", (req, res) => {
    res.render("admin/service/new");
});

// -------- Create New Service --------
router.post("/add", upload.single("image"), validateService, wrapAsync(async (req, res) => {
    if (!req.file) {
        req.flash("error", "Service image is required");
        return res.redirect("/admin/services/add");
    }

    const newService = new Services({
        ...req.body,
        image: {
            url: req.file.path,
            filename: req.file.filename
        }
    });

    await newService.save();
    req.flash("success", "Service created successfully!");
    res.redirect("/admin/services");
}));

// -------- Edit Service Form --------
router.get("/edit/:id", wrapAsync(async (req, res) => {
    const service = await Services.findById(req.params.id);
    if (!service) {
        req.flash("error", "Service not found");
        return res.redirect("/admin/services");
    }
    res.render("admin/service/edit", { service });
}));

// -------- Update Service --------
router.put("/edit/:id", upload.single("image"), validateService, wrapAsync(async (req, res) => {
    const service = await Services.findById(req.params.id);
    if (!service) {
        req.flash("error", "Service not found");
        return res.redirect("/admin/services");
    }

    service.name = req.body.name;
    service.description = req.body.description;
    service.price = req.body.price;
    service.duration = req.body.duration;

    if (req.file) {
        if (service.image?.filename) {
            await cloudinary.uploader.destroy(service.image.filename);
        }
        service.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await service.save();
    req.flash("success", "Service updated successfully!");
    res.redirect("/admin/services");
}));

// -------- Delete Service --------
router.post("/delete/:id", wrapAsync(async (req, res) => {
    const service = await Services.findById(req.params.id);
    if (!service) {
        req.flash("error", "Service not found");
        return res.redirect("/admin/services");
    }

    if (service.image?.filename) {
        await cloudinary.uploader.destroy(service.image.filename);
    }

    await Services.findByIdAndDelete(req.params.id);
    req.flash("success", "Service deleted successfully!");
    res.redirect("/admin/services");
}));

module.exports = router;
