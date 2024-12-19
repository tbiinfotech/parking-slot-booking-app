const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,  // Transaction ID from the payment gateway (Stripe)
    },
    date: {
      type: Date,
      default: Date.now,  // Date when the payment was completed
    },
    customerName: {
      type: String,
      required: true,  // Customer's name (extracted from metadata or user data)
    },
    customerPhoneNumber: {
      type: String,
      required: true,  // Customer's phone number
    },
    hostName: {
      type: String,
      required: true,  // Host's name (from the listing or seller)
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',  // Reference to the listing being booked
      required: true,
    },
    listingTitle: {
      type: String,
      required: true,  // Title or name of the listing
    },
    amount: {
      type: Number,
      required: true,  // Amount paid, typically in cents
    },
    currency: {
      type: String,
      default: 'usd',  // Currency of the transaction (can be extended if needed)
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',  // Status of the payment
    },
    bookingStatus: {        
      type: String,
      enum: ['confirmed', 'pending', 'cancelled'],
      default: 'pending',  // Booking status after payment confirmation
    },
    paymentMethod: {
      type: String,
      required: true,  // Payment method (e.g., 'credit_card', 'bank_transfer')
    },
    paymentDate: {
      type: Date,
      default: Date.now,  // Date of payment (can be adjusted based on Stripe event)
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',  // Reference to the user making the booking
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: true,  // Stripe session ID to link this payment to Stripe checkout session
    },
    metadata: {
      type: Map,
      of: String,  // Store any additional metadata here if needed (from Stripe)
    },
  },
  {
    timestamps: true,  // Automatically include createdAt and updatedAt fields
  }
);

// Create a model based on the schema
const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
