const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Parking', 'Storage'], required: true },

    // Plans for Parking
    plan: { type: String, enum: ['hourly', 'daily', 'monthly', 'yearly'], required: true },
    price: { type: String, required: true },

    typeOfSpace: { type: String, enum: ['Indoor', 'Outdoor'], required: true },
    location: {
        address: { type: String, required: true },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            required: true,
            index: '2dsphere'  // Geospatial index
        }
    },

    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number }
    },
    amenities: {
        type: [String],
        enum: ['ClimateControlled', 'SmokeDetectors', 'PetFree', 'SmokeFree', 'PrivateSpace', 'SecurityCamera'],
        default: []
    },
    vehicleType: { type: String, enum: ['Compact', 'Standard', 'RV', 'Boat', 'LargeVehicles', 'Motorcycle'], required: true },
    spaceType: { type: String, enum: ['Residential', 'Commercial'], required: true },
    photos: [{ type: String }],
    status: { type: String, enum: ['Available', 'RentOut'], default: 'Available' }
}, { timestamps: true });

// Create the model
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
