const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Parking', 'Storage'], required: true },
    
    rentalParkingPlan: { type: String, enum: ['Hourly', 'Daily', 'Monthly'], required: true },
    storagePlan: { type: String, enum: ['Daily', 'Monthly', 'Yearly'], required: true },

    typeOfSpace: { type: String, enum: ['Indoor', 'Outdoor'], required: true },
    location: {
        address: { type: String, required: true },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },

    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number }
    },
    amenities: { 
        type: [String], // Change to an array of strings
        enum: ['ClimateControlled', 'SmokeDetectors', 'PetFree', 'SmokeFree', 'PrivateSpace', 'SecurityCamera'], 
        required: true 
    },
    vehicleType: { type: String, enum: ['Compact', 'Standard', 'RV', 'Boat', 'LargeVehicles', 'Motorcycle'], required: true },
    spaceType: { type: String, enum: ['Residential', 'Commercial'], required: true },
    photos: [{ type: String }],
    status: { type: String, enum: ['Available', 'RentOut'], default: 'Available' }
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
