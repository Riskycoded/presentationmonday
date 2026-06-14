require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { connectDB } = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Passport Middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Initialize Database Connection
connectDB();

// Middlewares
app.use(cors({
  origin: 'http://localhost:8080', // Allow requests from our React App port 8080
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(logger);

// Base Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'connected', time: new Date() });
});

// Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);

// Fallback Route for non-matching URLs
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Express Full-Stack Server running on http://localhost:${PORT}`);
});
