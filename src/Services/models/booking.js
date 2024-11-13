const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    vehicleNumber: {
        type: String,
        required: true,
        trim: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' is the model name for users
        required: true
    },
    status: {
        type: String,
        trim: true
    }, paymentStatus: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt
});

// module.exports = mongoose.model('Booking', bookingSchema);
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
