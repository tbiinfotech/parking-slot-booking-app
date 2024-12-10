const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: {
    type: String,
    required: true,
  },
  otpExpires: {
    type: Date,
    required: true,
  },
});

otpSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 120 });

module.exports = mongoose.model('Otp', otpSchema);
