const crypto = require('crypto')
const Notification = require('../src/Services/models/notification')

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
  return crypto.randomInt(10000, 99999).toString();
};

const createNotification = async (notificationData) => {
  try {
    // Create a new notification instance
    const notification = new Notification({
      recipient: notificationData.recipient,
      sender: notificationData.sender,
      message: notificationData.message,
      type: notificationData.type,
    });

    // Save the notification to the database
    const savedNotification = await notification.save();
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

module.exports = {
  generateTempPassword,
  generateUniqueToken, generateOTP, createNotification
};
