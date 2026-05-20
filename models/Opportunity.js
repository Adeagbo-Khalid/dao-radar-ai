const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  externalId: { type: String, unique: true },
  type: { type: String, enum: ['bounty', 'gig', 'grant', 'quest'] },
  title: String,
  description: String,
  reward: String,
  status: String,
  network: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);