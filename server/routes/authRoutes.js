const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const { connectDB } = require('../config/db');

// Helper function to create a new session in MongoDB
async function createAdminSession(email) {
  const db = await connectDB();
  const sessionId = 'sess_' + crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Session valid for 24 hours

  await db.collection('sessions').insertOne({
    sessionId,
    email,
    createdAt: new Date(),
    expiresAt
  });

  return sessionId;
}

// @desc    Admin login using secure bcrypt verification + DB Session ID generation
// @route   POST /api/auth/login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'adebanjom16@gmail.com';
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminHash) {
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error: Admin password hash is missing' 
      });
    }

    // Verify email matches the admin email config
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    // Verify password matches using Bcrypt
    const isMatch = await bcrypt.compare(password, adminHash);

    if (isMatch) {
      // Generate and store session in MongoDB
      const sessionId = await createAdminSession(adminEmail);
      res.json({ success: true, token: sessionId, email: adminEmail });
    } else {
      res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Initiate Google OAuth login process
// @route   GET /api/auth/google
router.get('/google', (req, res, next) => {
  // Check if actual Google keys are configured
  const clientID = process.env.GOOGLE_CLIENT_ID;
  if (!clientID || clientID === 'your_google_client_id_here') {
    // Redirect to mock simulation endpoint if keys are not ready
    return res.redirect('/api/auth/google/mock');
  }
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// @desc    Google OAuth Callback endpoint - generates DB Session ID
// @route   GET /api/auth/google/callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      return res.redirect('http://localhost:8080/admin/login?error=unauthorized');
    }

    try {
      // Generate and store session in MongoDB for Google user
      const sessionId = await createAdminSession(user.email);
      // Redirect to the frontend admin dashboard, passing the Session ID in query parameters
      return res.redirect(`http://localhost:8080/admin?token=${sessionId}`);
    } catch (dbError) {
      return res.redirect('http://localhost:8080/admin/login?error=db_error');
    }
  })(req, res, next);
});

// @desc    Google OAuth Mock Simulation - generates DB Session ID
// @route   GET /api/auth/google/mock
router.get('/google/mock', async (req, res) => {
  console.log('🤖 Simulating Google OAuth success for local demo...');
  
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'adebanjom16@gmail.com';
    // Generate and store session in MongoDB
    const sessionId = await createAdminSession(adminEmail);
    // Redirect to frontend dashboard with mock token
    res.redirect(`http://localhost:8080/admin?token=${sessionId}`);
  } catch (error) {
    res.redirect('http://localhost:8080/admin/login?error=db_error');
  }
});

// @desc    Log out and revoke active session ID in MongoDB
// @route   POST /api/auth/logout
router.post('/logout', async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const db = await connectDB();
      // Delete session document from database (revoke token)
      await db.collection('sessions').deleteOne({ sessionId: token });
      console.log(`🗑️ Revoked session: ${token}`);
    }

    res.json({ success: true, message: 'Logged out successfully, session revoked.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
