const mongoose = require('mongoose');

const stripeKeysSchema = new mongoose.Schema(
  {
    publicKey: {
      type: String,
      required: true,
    },
    secretKey: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const StripeKeys = mongoose.model('StripeKeys', stripeKeysSchema);

module.exports = StripeKeys;
