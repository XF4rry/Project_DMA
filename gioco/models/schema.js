const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  id: { type: String, unique: true },
  hints: [String]
});

module.exports = mongoose.model('Song', songSchema);
    