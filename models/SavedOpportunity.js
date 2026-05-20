const mongoose = require('mongoose');

const SavedOpportunitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  externalId: String,
  type: String,
  title: String,
  description: String,
  reward: String,
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedOpportunity', SavedOpportunitySchema);