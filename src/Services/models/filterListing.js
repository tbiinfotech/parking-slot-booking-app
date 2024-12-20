const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // Ensure this filter is associated with a user
    },
    radiusInMiles: {
        type: Number, // Radius for location-based filtering
    },
    type: {
        type: String, // Type of service or item
        enum: ["Storage", "Parking", "Other"], // Restrict to valid types
    },
    plan: {
        type: String, // Plan type
        enum: ['Hourly', 'Daily', 'Monthly', 'Yearly'], // Define valid plan options
    },
    minPrice: {
        type: Number, // Minimum price for filtering
        default: 0,
    },
    maxPrice: {
        type: Number, // Maximum price for filtering
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model("Filter", filterSchema);
