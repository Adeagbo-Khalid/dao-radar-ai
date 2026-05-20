const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.session.token;
    if (!token) return res.redirect('/login');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'daoradarai_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.redirect('/login');
  }
};