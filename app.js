require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');

const app = express();


// Models
const Admin = require('./models/admin');
const { isAdminLoggedIn } = require('./middleware');

// Routers (Admin)
const adminRouter = require('./router/login'); 
const dashboardRouter = require('./router/dashboard');
const bookingRouter = require('./router/booking');
const customersRouter = require('./router/customers');
const galleryRouter = require('./router/gallery');
const serviceRouter = require('./router/service');
const staffRouter = require('./router/staff');
const settingRouter = require('./router/settings');

// Routers (User - agar aapne banaya ho)
const userRouter = require('./router/user'); 

// Middleware Setup
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }, 
  })
);

app.use(flash());

// Flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


app.use(async (req, res, next) => {
  try {
    let admin = null;
    if (req.session.adminId) {
      admin = await Admin.findById(req.session.adminId);
    }
    if (!admin) {
      admin = await Admin.findOne(); 
    }
    res.locals.admin = admin || {}; 
  } catch (err) {
    res.locals.admin = {}; 
  }
  next();
});

// --- EJS Setup ---
app.use((req, res, next) => {
  if (req.path.startsWith('/admin')) {
    res.locals.layout = 'layouts/admin';
  } else {
    res.locals.layout = 'layouts/user';
  }
  next();
});

app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Admin Routes
// ----------------------
app.use('/admin', adminRouter);
app.use('/admin/dashboard', isAdminLoggedIn, dashboardRouter);
app.use('/admin/booking', isAdminLoggedIn, bookingRouter);
app.use('/admin/customers', isAdminLoggedIn, customersRouter);
app.use('/admin/gallery', isAdminLoggedIn, galleryRouter);
app.use('/admin/services', isAdminLoggedIn, serviceRouter);
app.use('/admin/staff', isAdminLoggedIn, staffRouter);
app.use('/admin/settings', isAdminLoggedIn, settingRouter);

app.get('/admin', (req, res) => {
  if (req.session.adminId) return res.redirect('/admin/dashboard');
  return res.redirect('/admin/login');
});

// User Routes
app.use('/', userRouter); 

app.get('/', (req, res) => {
  res.redirect('/') ; // ya koi specific user route, e.g., /user/home
});
// Error Handler

app.use((err, req, res, next) => {
  console.error('Error handler caught:', err);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong!';
  res.status(statusCode).render('error', { err });
});


// Start Server

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
