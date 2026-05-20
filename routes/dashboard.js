const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavedOpportunity = require('../models/SavedOpportunity');
const User = require('../models/User');
const axios = require('axios');

const API_BASE = 'https://zeroauthoritydao.com/api';

router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const saved = await SavedOpportunity.find({ user: req.user.id });
    const bounties = await axios.get(`${API_BASE}/bounties`);
    const gigs = await axios.get(`${API_BASE}/gigs`);
    const grants = await axios.get(`${API_BASE}/grants`);
    res.render('dashboard', {
      title: 'Dashboard',
      user,
      saved,
      stats: {
        bounties: bounties.data.data?.length || 0,
        gigs: gigs.data.data?.length || 0,
        grants: grants.data.data?.length || 0,
        saved: saved.length
      }
    });
  } catch (err) {
    console.log('DASHBOARD ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;