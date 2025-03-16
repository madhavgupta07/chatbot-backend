const mongoose = require('mongoose');

const Chat = new mongoose.Schema({
  userMessage: String,
  botResponse: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', Chat);