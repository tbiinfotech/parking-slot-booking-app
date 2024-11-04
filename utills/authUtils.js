const crypto = require('crypto')

function generateTempPassword() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function generateUniqueToken() {
  const min = 100000000000; // Minimum 12-digit number
  const max = 999999999999; // Maximum 12-digit number
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

// Generate an OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

module.exports = {
  generateTempPassword,
  generateUniqueToken, generateOTP
};
