const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    let token;

    // Try to get token from cookie or authorization header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token found. Please login.' });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    // ⭐ FIX HERE
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.',
    });
  }
};
