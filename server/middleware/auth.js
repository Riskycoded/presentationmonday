const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Header format: 'Authorization: Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Decrypt and verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Pass the decoded payload (e.g. isAdmin: true) to the request object
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token signature' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Token missing' });
  }
};

module.exports = protect;
