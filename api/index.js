require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const dbConnection = require('../config/db');

const employeeRoute = require('../routes/employee');
const auth = require('../routes/auth');
const offerLetterRoutes = require('../routes/offerLetter');
const appointmentLetter = require('../routes/appointmentLetter');
const terminationLetter = require('../routes/terminationLetter');
const onboardingRoutes = require('../routes/onboarding');
const salaryRoutes = require('../routes/salarySlip');
const fnfRoutes = require('../routes/fnf');

// Connect DB
dbConnection();

app.use(cors({
  origin: '*', // allow frontend in production
  credentials: true,
}));

app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/employee', employeeRoute);
app.use('/api/auth', auth);
app.use('/api/offer-letters', offerLetterRoutes);
app.use('/api/appointment-letters', appointmentLetter);
app.use('/api/termination-letters', terminationLetter);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/salarySlip', salaryRoutes);
app.use('/api/fnf', fnfRoutes);

// Debug
app.get('/uploads/debug-test', (req, res) => {
  res.send('Static middleware is active!');
});

// IMPORTANT: export app for Vercel
module.exports = app;
