const { adminSchema, blogPostSchema, bookingSchema, customerSchema, galleryImageSchema, imageSchema, serviceSchema, reviewSchema, staffSchema } = require("./Schema.js");
const Admin = require("./models/admin");
const Booking = require("./models/booking");
const Customer = require("./models/customer");
const GalleryImage = require("./models/gallery");
const Image = require("./models/image");
const Service = require("./models/service");

const Staff = require("./models/staff");
const ExpressError = require("./utils/ExpressError");

// ---------- Validation Middlewares ----------
module.exports.validateAdmin = (req, res, next) => {
 const { error } = adminSchema.validate(req.body, { allowUnknown: true });
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.validateBlogPost = (req, res, next) => {
  const { error } = BlogPost.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateBooking = (req, res, next) => {
    const { error } = Booking.validate(req.body, { abortEarly: false });
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.validateCustomer = (req, res, next) => {
  const { error } = Customer.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateGalleryImage = (req, res, next) => {
  const { error } = GalleryImage.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateImage = (req, res, next) => {
  const { error } = Image.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateService = (req, res, next) => {
  const { error } = Service.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = review.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateStaff = (req, res, next) => {
    const { error } = Staff.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};


// ---------- Authentication & Authorization ----------
// middleware.js

// Admin ke liye
module.exports.isAdminLoggedIn = (req, res, next) => {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }
  next();
};

// User ke liye
module.exports.isUserLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Sirf tab chale jab koi bhi login na ho (na admin, na user)
module.exports.isNotLoggedIn = (req, res, next) => {
  if (req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  if (req.session.userId) {
    return res.redirect('/user/dashboard'); // ya jo bhi user ka dashboard route hai
  }
  next();
};
