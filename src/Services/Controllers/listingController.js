const Listing = require('../models/Listing');
const User = require('../models/users')
const { rentalListingSchema } = require('../../libs/schemaValidation')
const stripe = require('stripe')(`${process.env.STRIPE_KEY}`);
const fs = require('fs');

// 1. Create a new listing
exports.createListing = async (req, res) => {
    try {
        // Trim values and parse numbers
        const title = req.body.title?.trim();
        const description = req.body.description?.trim();
        const type = req.body.type?.trim();
        const rentalParkingPlan = req.body.rentalParkingPlan;
        const storagePlan = req.body.storagePlan;
        const typeOfSpace = req.body.typeOfSpace?.trim();
        const duration = req.body.duration?.trim();

        const location = {
            address: req.body.location.address?.trim() || '',
            coordinates: [
                parseFloat(req.body.location.coordinates[0]) || 0,  // Default to 0 if parsing fails
                parseFloat(req.body.location.coordinates[1]) || 0   // Default to 0 if parsing fails
            ]
        };

        const dimensions = {
            length: parseFloat(req.body.dimensions.length) || 0,  // Default to 0 if parsing fails
            width: parseFloat(req.body.dimensions.width) || 0,    // Default to 0 if parsing fails
            height: parseFloat(req.body.dimensions.height) || 0   // Default to 0 if parsing fails
        };

        // Handle amenities as an array of strings
        const amenities = Array.isArray(req.body.amenities)
            ? req.body.amenities.map(a => a.trim()).filter(Boolean)  // Trim and filter out any empty values
            : [];

        const vehicleType = req.body.vehicleType?.trim();
        const spaceType = req.body.spaceType?.trim();

        // Handle photos if files are uploaded
        const photos = req.files ? req.files.map(file => file.path) : [];

        // Parse and convert the rentalParkingPlan's price fields to numbers
        if (rentalParkingPlan) {
            if (rentalParkingPlan.hourly) {
                rentalParkingPlan.hourly.price = parseFloat(rentalParkingPlan.hourly.price.trim()) || 0;
            }
            if (rentalParkingPlan.daily) {
                rentalParkingPlan.daily.price = parseFloat(rentalParkingPlan.daily.price.trim()) || 0;
            }
            if (rentalParkingPlan.monthly) {
                rentalParkingPlan.monthly.price = parseFloat(rentalParkingPlan.monthly.price.trim()) || 0;
            }
        }

        // Validate required fields
        const { error, value } = rentalListingSchema.validate({ title, description, type, rentalParkingPlan, storagePlan, typeOfSpace, location, dimensions, amenities, vehicleType, spaceType });
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        // Create a new listing and save it to the database
        const listing = new Listing({
            owner: req.user.id,  // Assume user is authenticated and user ID is available
            title,
            description,
            type,
            rentalParkingPlan,
            storagePlan,
            typeOfSpace,
            location,
            duration,
            dimensions,
            amenities,
            vehicleType,
            spaceType,
            photos
        });

        await listing.save();
        res.status(201).json({ success: true, message: 'Listing created successfully', listing });
    } catch (error) {

        console.log('create space list error', error)
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getUserAddresses = async (req, res) => {
    try {
        // Extract owner ID from request parameters or user session
        const ownerId = req.user.id; // Assume user is authenticated and owner ID is available

        // Find all listings for the specified owner
        const listings = await Listing.find({ owner: ownerId });

        // Extract addresses from listings
        const addresses = listings.map(listing => ({
            address: listing.location.address,
            coordinates: listing.location.coordinates
        }));

        // Check if addresses were found
        if (addresses.length === 0) {
            return res.status(404).json({ success: false, message: 'No addresses found for this owner.' });
        }

        res.status(200).json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllAddresses = async (req, res) => {
    try {
        // Fetch all listings from the database
        const listings = await Listing.find({}).populate('owner');

        // Extract addresses from listings
        const addresses = listings.map(listing => ({
            address: listing.location.address,
            coordinates: listing.location.coordinates
        }));


        // Check if addresses were found
        if (addresses.length === 0) {
            return res.status(404).json({ success: false, message: 'No addresses found.' });
        }

        return res.json({
            status: 200,
            response: listings,
            success: true,
            message: "Data found",
        });

        // res.status(200).json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllAddressesWithPaginagtion = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;

        // Define your filter criteria (if needed, adjust it accordingly)
        const filter = {}; // No specific filters are applied for now

        // Fetch the listings with pagination
        const listings = await Listing.find({}).populate('owner').skip(skip).limit(limit);

        // Extract addresses from listings
        const addresses = listings.map(listing => ({
            address: listing.location.address,
            coordinates: listing.location.coordinates,
        }));

        // Get the total count of listings for pagination info
        const totalListings = await Listing.countDocuments(filter);
        const totalPages = Math.ceil(totalListings / limit);

        // Check if addresses were found
        if (addresses.length === 0) {
            return res.status(404).json({ success: false, message: 'No addresses found.' });
        }

        return res.json({
            status: 200,
            data: {
                records: listings,
                pagination: {
                    totalListings,
                    totalPages,
                    currentPage: page,
                    limit,
                },
            },
            success: true,
            message: "Data found",
        });

    } catch (error) {
        console.error("Error while fetching addresses:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


exports.getAddressByListId = async (req, res) => {
    try {

        const { listingId } = req.params
        // Fetch all listings from the database
        const listings = await Listing.find({ _id: listingId }).populate('owner');

        // Extract addresses from listings
        const addresses = listings.map(listing => ({
            address: listing.location.address,
            coordinates: listing.location.coordinates
        }));


        // Check if addresses were found
        if (addresses.length === 0) {
            return res.status(404).json({ success: false, message: 'No addresses found.' });
        }

        return res.json({
            status: 200,
            response: listings,
            success: true,
            message: "Data found",
        });

        // res.status(200).json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.addToFavorites = async (req, res) => {
    try {
        const { listingId } = req.body; // Expecting listingId to be sent in the request body

        // Find the listing
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found.' });
        }

        // Find the user and update their favorites
        const user = await User.findById(req.user.id); // Assuming req.user contains the authenticated user
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Check if the listing is already in favorites
        if (user.favorites.includes(listingId)) {
            user.favorites = user.favorites.filter(id => id.toString() !== listingId);
            await user.save();
            return res.status(200).json({ success: true, message: 'Listing removed from favorites.' });
        }

        // Add the listing to favorites
        user.favorites.push(listingId);
        await user.save();

        res.status(200).json({ success: true, message: 'Listing added to favorites successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFavoriteAddresses = async (req, res) => {
    try {
        // Find the user
        const user = await User.findById(req.user.id).populate('favorites'); // Populate to get full listing details
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }


        console.log('getFavoriteAddresses user', user)
        // Extract addresses from favorites
        const favoriteAddresses = user.favorites.map(listing => ({
            address: listing.location.address,
            coordinates: listing.location.coordinates,
            title: listing.title
        }));

        // Check if there are favorite addresses
        if (favoriteAddresses.length === 0) {
            return res.status(404).json({ success: false, message: 'No favorite addresses found.' });
        }

        res.status(200).json({ success: true, favorites: favoriteAddresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



exports.updateListingStatus = async (req, res) => {
    try {
        const { listingId } = req.params; // Expecting listingId to be in the URL parameters

        // Find the listing by ID
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found.' });
        }

        // Check if the current status is "Available"
        if (listing.status !== 'Available') {
            return res.status(400).json({ success: false, message: 'Listing status is not available to update.' });
        }

        // Update the status to "Rent Out"
        listing.status = 'RentOut';
        await listing.save();

        res.status(200).json({ success: true, message: 'Listing status updated to Rent Out.', listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



exports.removeListing = async (req, res) => {
    try {
        const { listingId } = req.params; // Expecting listingId to be in the URL parameters

        // Find the listing by ID
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found.' });
        }

        console.log('req.user', req.user)
        // Check if the requester is the owner of the listing
        if (listing.owner.toString() !== req.user.id && req.user.role !== 'owner') {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this listing.' });
        }
        await Listing.findByIdAndDelete(listingId);

        res.status(200).json({ success: true, message: 'Space removed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Ensure fs module is required if you are deleting files
exports.editListing = async (req, res) => {
    try {
        const { listingId } = req.params;

        // Find the listing by ID
        let listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found.' });
        }

        // Check if the requester is the owner of the listing
        if (listing.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to edit this listing.' });
        }

        // Trim and parse fields for updating, falling back to current listing values if not provided
        const title = req.body.title?.trim() || listing.title;
        const description = req.body.description?.trim() || listing.description;
        const type = req.body.type?.trim() || listing.type;
        const rentalParkingPlan = req.body.rentalParkingPlan || listing.rentalParkingPlan;
        const storagePlan = req.body.storagePlan || listing.storagePlan;
        const typeOfSpace = req.body.typeOfSpace?.trim() || listing.typeOfSpace;
        const duration = req.body.duration?.trim() || listing.duration;

        // Handle location
        const location = req.body.location ? {
            address: req.body.location.address?.trim() || listing.location.address,
            coordinates: [
                parseFloat(req.body.location.coordinates[0]) || listing.location.coordinates[0],
                parseFloat(req.body.location.coordinates[1]) || listing.location.coordinates[1]
            ]
        } : listing.location;

        // Handle dimensions
        const dimensions = req.body.dimensions ? {
            length: parseFloat(req.body.dimensions.length) || listing.dimensions.length,
            width: parseFloat(req.body.dimensions.width) || listing.dimensions.width,
            height: parseFloat(req.body.dimensions.height) || listing.dimensions.height
        } : listing.dimensions;

        // Handle amenities (filter out empty values)
        const amenities = Array.isArray(req.body.amenities)
            ? req.body.amenities.map(a => a.trim()).filter(Boolean)
            : listing.amenities;

        const vehicleType = req.body.vehicleType?.trim() || listing.vehicleType;
        const spaceType = req.body.spaceType?.trim() || listing.spaceType;

        // Handle photos if files are uploaded
        if (req.files && req.files.length > 0) {
            // Delete old photos from the file system
            listing.photos.forEach(photoPath => {
                fs.unlink(photoPath, (err) => {
                    if (err) console.error(`Failed to delete old photo at ${photoPath}:`, err);
                });
            });

            // Add new photos
            listing.photos = req.files.map(file => file.path);
        }

        // Validate required fields
        const { error, value } = rentalListingSchema.validate({ title, description, type, rentalParkingPlan, storagePlan, typeOfSpace, location, dimensions, amenities, vehicleType, spaceType });
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        // Update the listing fields
        listing.title = title;
        listing.description = description;
        listing.type = type;
        listing.rentalParkingPlan = rentalParkingPlan;
        listing.storagePlan = storagePlan;
        listing.typeOfSpace = typeOfSpace;
        listing.duration = duration;
        listing.location = location;
        listing.dimensions = dimensions;
        listing.amenities = amenities;
        listing.vehicleType = vehicleType;
        listing.spaceType = spaceType;

        // Save the updated listing
        await listing.save();

        // Respond with the updated listing
        res.status(200).json({ success: true, message: 'Listing updated successfully', listing });

    } catch (error) {
        console.error('Error editing listing:', error);  // Log the error for debugging
        res.status(500).json({ success: false, message: 'An error occurred while updating the listing.' });
    }
};



exports.deleteAllListing = async (req, res) => {
    const { listIds } = req.body
    try {
        const deleteListing = await Listing.deleteMany({ _id: { $in: listIds } })

        return res.status(200).json({
            message: "Space deleted successfully",
            status: true,
            success: true,
            deleteListing
        })

    } catch (error) {
        console.log('space all delete error :', error)
        return res.status(500).json({
            status: false,
            message: 'Error in deleting multiple ids'
        })
    }
}




// 2. Search for listings with filters
exports.searchListings = async (req, res) => {
    try {
        const { type, duration, minPrice, maxPrice, location, maxDistance, amenities } = req.query;

        // Base filter object
        const filter = { status: 'Available' };

        if (type) filter.type = type;
        if (duration) filter.duration = duration;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (amenities) filter.amenities = { $all: amenities.split(',') };

        // Geolocation-based filtering
        if (location && maxDistance) {
            const [longitude, latitude] = location.split(',');
            filter.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                    $maxDistance: parseInt(maxDistance) * 1000  // Convert km to meters
                }
            };
        }

        // Fetch listings based on filters
        const listings = await Listing.find(filter);
        res.status(200).json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
