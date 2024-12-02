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
  stripeAccountId: {
    type: String,
    required: false,
    unique: true,
    sparse: true      // Optional: This allows users without a Stripe account to still exist in the DB
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  preference: {
    type: String,
    enum: ["storage", "parking"],
    default: "storage",
  },
  pushNotification: {
    type: Boolean,
    default: false, // Flag to check if the user is verified
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
  isDeleted: {
    type: Boolean,
    default: false, // User is not deleted by default
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model("User", userSchema);
