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
    deviceId: {
      type: String,
      default: ""
    },
    latitude: {
      type: String, // Store the OTP code
      default: 0,
    },
    longitude: {
      type: String, // Store the OTP code
      default: 0,
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

// Set up a change stream to watch the PendingUser collection


// TTL index to automatically remove expired OTP records
// PendingUserSchema.index({ otpExpir12es: 1 }, { expireAfterSeconds: 600 });


// Create the model from the schema
const PendingUser = mongoose.model('PendingUser', PendingUserSchema);

const changeStream = PendingUser.watch([
  { $match: { 'operationType': 'delete' } } // Watch only delete operations
]);

// Listen for delete events
changeStream.on('change', (change) => {
  console.log(`Document deleted: ${JSON.stringify(change.documentKey)}`);

});

module.exports = PendingUser;
