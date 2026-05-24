const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_BASE = 'https://zeroauthoritydao.com/api';

router.get('/', async (req, res) => {
  try {
    res.render('index', { title: 'DAO Radar AI' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/discover', async (req, res) => {
  try {
    if (!req.session.token) return res.redirect('/login');
    res.render('discover', { title: 'Discover Opportunities' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/api/bounties', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/bounties`);
    res.json(response.data.data || response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bounties' });
  }
});

router.get('/api/gigs', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/gigs`);
    res.json(response.data.data || response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gigs' });
  }
});

router.get('/api/grants', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/grants`);
    res.json(response.data.data || response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grants' });
  }
});

router.get('/api/quests', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/quests`);
    res.json(response.data.data || response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
});

router.get('/api/events', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/events`);
    res.json(response.data.data || response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/api/stats', async (req, res) => {
  try {
    const [bounties, gigs, grants] = await Promise.all([
      axios.get(`${API_BASE}/bounties`),
      axios.get(`${API_BASE}/gigs`),
      axios.get(`${API_BASE}/grants`)
    ]);
    res.json({
      bounties: bounties.data.data?.length || 0,
      gigs: gigs.data.data?.length || 0,
      grants: grants.data.data?.length || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/detail/:type/:id', async (req, res) => {
  try {
    if (!req.session.token) return res.redirect('/login');
    const { type, id } = req.params;
    let url = '';
    if (type === 'bounty') url = `${API_BASE}/bounties/${id}`;
    if (type === 'gig') url = `${API_BASE}/gigs/${id}`;
    if (type === 'grant') url = `${API_BASE}/grants/${id}`;
    if (type === 'quest') url = `${API_BASE}/quests/${id}`;
    if (type === 'event') url = `${API_BASE}/events/${id}`;
    const response = await axios.get(url);
    const item = response.data.data || response.data;
    res.render('detail', { title: item.title || item.name || 'Detail', item, type });
  } catch (err) {
    console.log('DETAIL ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;