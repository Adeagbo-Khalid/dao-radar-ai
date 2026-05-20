const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => cb(null, req.user.id + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.render('settings', { title: 'Settings', user, success: null, error: null });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/settings/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { avatar: '/uploads/' + req.file.filename });
    const user = await User.findById(req.user.id);
    res.render('settings', { title: 'Settings', user, success: 'Profile picture updated!', error: null });
  } catch (err) {
    res.render('settings', { title: 'Settings', user: await User.findById(req.user.id), success: null, error: 'Upload failed' });
  }
});

router.post('/settings/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.render('settings', { title: 'Settings', user, success: null, error: 'Current password is wrong' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.render('settings', { title: 'Settings', user, success: 'Password updated!', error: null });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/settings/wallet', auth, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    await User.findByIdAndUpdate(req.user.id, { walletAddress });
    const user = await User.findById(req.user.id);
    res.render('settings', { title: 'Settings', user, success: 'Wallet connected!', error: null });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/settings/profile', auth, async (req, res) => {
  try {
    const { username, skills, interests } = req.body;
    const skillsArr = skills ? skills.split(',').map(s => s.trim()) : [];
    const interestsArr = interests ? interests.split(',').map(s => s.trim()) : [];
    await User.findByIdAndUpdate(req.user.id, { username, skills: skillsArr, interests: interestsArr });
    const user = await User.findById(req.user.id);
    res.render('settings', { title: 'Settings', user, success: 'Profile updated!', error: null });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;