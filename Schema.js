const Joi = require("joi");

// Admin Schema
module.exports.adminSchema = Joi.object({
  adminName: Joi.string().required(),
   contactPhone: Joi.string().required(),
    contactEmail: Joi.string().email().required(),
    yearsOfExperience: Joi.number().min(0).required(),
    happyCustomers: Joi.number().min(0).required(),
    address: Joi.string().allow(""),
    aboutUsText: Joi.string().allow(""),
    discountOfferText: Joi.string().allow(""),
    footerAboutText: Joi.string().allow(""),
    profileImage: Joi.any() 
});


// BlogPost Schema
module.exports.blogPostSchema = Joi.object({
  title: Joi.string().trim().required(),
  publicationDate: Joi.date().optional(),
  category: Joi.string().trim().required(),
  contentSnippet: Joi.string().trim().required(),
  imageUrl: Joi.string().uri().required()
});

// Customer Schema
module.exports.customerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().required(),
  totalVisits: Joi.number().min(0).optional()
});

// Booking Schema
module.exports.bookingSchema = Joi.object({
    customer: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
    }).required(),
    serviceId: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    notes: Joi.string().allow('').optional()
});

// GalleryImage Schema
module.exports.galleryImageSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    imageUrl: Joi.string()
});

// Image Schema
module.exports.imageSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  imageUrl: Joi.string().uri().required()
});

// Service Schema
module.exports.serviceSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),
  duration: Joi.string().trim().optional(),
  image: Joi.object({
    url: Joi.string().uri().required(),
    filename: Joi.string().required()
  }).required(),
  bookings: Joi.array().items(Joi.string()).optional()
});


// Review Schema
module.exports.reviewSchema = Joi.object({
  customer: Joi.string().required(), // ObjectId as string
  rating: Joi.number().min(1).max(5).required(),
  reviewText: Joi.string().trim().required()
});

// Staff Schema
module.exports.staffSchema = Joi.object({
  name: Joi.string().trim().required(),
  specialization: Joi.string().trim().required(),
  image: Joi.object({
    url: Joi.string().uri().required(),
    filename: Joi.string().required()
  }).required()
});