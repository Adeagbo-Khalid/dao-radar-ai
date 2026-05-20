const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const SavedOpportunity = require('../models/SavedOpportunity');

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const saved = await SavedOpportunity.find({ user: req.user.id });
    res.render('profile', { title: 'Profile', user, saved });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/save-opportunity', auth, async (req, res) => {
  try {
    const { externalId, type, title, description, reward } = req.body;
    const exists = await SavedOpportunity.findOne({ user: req.user.id, externalId });
    if (!exists) {
      await SavedOpportunity.create({ user: req.user.id, externalId, type, title, description, reward });
    }
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;