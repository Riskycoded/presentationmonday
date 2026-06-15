require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

// Security Headers
app.use(helmet());

// Initialize Passport Middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Initialize Database Connection
connectDB();

const allowedOrigins = [
  'http://localhost:8080',
  'https://presentationmonday-kappa.vercel.app',
  'https://riskycoded.site',
  'https://www.riskycoded.site'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') || 
                      (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL);
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(logger);

// Rate Limiters
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, error: 'Too many messages sent. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Base Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'connected', time: new Date() });
});

// Route Handlers
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactLimiter, contactRoutes);

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
