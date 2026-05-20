const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'daoradarai_secret';

router.get('/login', (req, res) => res.render('auth/login', { title: 'Login', error: null }));
router.get('/signup', (req, res) => res.render('auth/signup', { title: 'Signup', error: null }));

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Signup attempt:', username, email);
    const exists = await User.findOne({ email });
    if (exists) return res.render('auth/signup', { title: 'Signup', error: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    console.log('User created:', user._id);
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET);
    req.session.token = token;
    req.session.user = { id: user._id, username: user.username };
    res.redirect('/dashboard');
  } catch (err) {
    console.log('SIGNUP ERROR:', err.message);
    res.render('auth/signup', { title: 'Signup', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    const user = await User.findOne({ email });
    if (!user) return res.render('auth/login', { title: 'Login', error: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('auth/login', { title: 'Login', error: 'Wrong password' });
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET);
    req.session.token = token;
    req.session.user = { id: user._id, username: user.username };
    res.redirect('/dashboard');
  } catch (err) {
    console.log('LOGIN ERROR:', err.message);
    res.render('auth/login', { title: 'Login', error: err.message });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;