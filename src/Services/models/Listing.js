const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Parking', 'Storage'], required: true },

    // Plans for Parking
    rentalParkingPlan: {
        hourly: {
            price: { type: Number, required: function() { return this.type === 'Parking'; } }
        },
        daily: { 
            price: { type: Number, required: function() { return this.type === 'Parking'; } }
        },
        monthly: { 
            price: { type: Number, required: function() { return this.type === 'Parking'; } }
        }
    },

    // Plans for Storage
    storagePlan: {
        daily: { 
            price: { type: Number, required: function() { return this.type === 'Storage'; } }
        },
        monthly: { 
            price: { type: Number, required: function() { return this.type === 'Storage'; } }
        },
        yearly: { 
            price: { type: Number, required: function() { return this.type === 'Storage'; } }
        }
    },

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
        type: [String], 
        enum: ['ClimateControlled', 'SmokeDetectors', 'PetFree', 'SmokeFree', 'PrivateSpace', 'SecurityCamera'], 
        default: []
    },
    vehicleType: { type: String, enum: ['Compact', 'Standard', 'RV', 'Boat', 'LargeVehicles', 'Motorcycle'], required: true },
    spaceType: { type: String, enum: ['Residential', 'Commercial'], required: true },
    photos: [{ type: String }],
    status: { type: String, enum: ['Available', 'RentOut'], default: 'Available' }
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
