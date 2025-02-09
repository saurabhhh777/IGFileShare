const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  data: { type: String, required: true }, // Base64-encoded file data
  contentType: { type: String, required: true },
  expirationTime: { type: Number, required: true }, // Timestamp for expiration
});

module.exports = mongoose.model('File', fileSchema);
