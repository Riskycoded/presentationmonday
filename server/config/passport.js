const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { connectDB } = require('./db');

// Custom Database Session Strategy for Passport
function SessionStrategy(verify) {
  this.name = 'session';
  this.verify = verify;
}

SessionStrategy.prototype.authenticate = function (req, options) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return this.fail({ message: 'No session token provided' }, 401);
  }

  const self = this;
  this.verify(token, function (err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info, 401);
    }
    self.success(user, info);
  });
};

module.exports = (passport) => {
  // 1. Register Custom DB Session Strategy
  passport.use(
    'session',
    new SessionStrategy(async (token, done) => {
      try {
        const db = await connectDB();
        const session = await db.collection('sessions').findOne({ sessionId: token });

        if (!session) {
          return done(null, false, { message: 'Invalid or revoked session ID' });
        }

        // Check if session has expired
        if (new Date() > new Date(session.expiresAt)) {
          await db.collection('sessions').deleteOne({ sessionId: token });
          return done(null, false, { message: 'Session expired' });
        }

        // Return authenticated admin user details
        return done(null, { email: session.email, isAdmin: true });
      } catch (error) {
        return done(error, false);
      }
    })
  );

  // 2. Google OAuth Strategy (for authenticating and verifying Google emails)
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientID && clientSecret && clientID !== 'your_google_client_id_here') {
    passport.use(
      new GoogleStrategy(
        {
          clientID,
          clientSecret,
          callbackURL: 'http://localhost:5000/api/auth/google/callback',
          scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails[0].value;

            // Restrict admin dashboard access strictly to your specific Google email!
            if (email === process.env.ADMIN_EMAIL) {
              console.log(`✅ Admin authenticated via Google: ${email}`);
              return done(null, { email, isAdmin: true });
            } else {
              console.warn(`🛑 Google authentication rejected for non-admin email: ${email}`);
              return done(null, false, { message: 'Unauthorized email account' });
            }
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
  } else {
    console.log('⚠️ Google OAuth Credentials are not configured. Google Strategy is not registered.');
  }
};
