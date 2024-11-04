const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    // select: false, // Uncomment this if you don’t want to select the password by default in queries
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["owner", "customer"],
    default: "customer",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  otp: {
    type: String, // Store the OTP code
  },
  otpExpires: {
    type: Date, // Expiration time for OTP
  },
  token: {
    type: String, // Store the OTP code
  },
  tokenExpires: {
    type: Date, // Expiration time for OTP
  },
  isVerified: {
    type: Boolean,
    default: false, // Flag to check if the user is verified
  },
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model("User", userSchema);
