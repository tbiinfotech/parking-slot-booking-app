const mongoose = require('mongoose');

// Define the schema for Pending User
const PendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique in the pending users collection
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// TTL index to automatically remove expired OTP records
PendingUserSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

// Create the model from the schema
const PendingUser = mongoose.model('PendingUser', PendingUserSchema);

module.exports = PendingUser;
