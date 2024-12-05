const Listing = require('../models/Listing');
const User = require('../models/users')
const { rentalListingSchema } = require('../../libs/schemaValidation')
const stripe = require('stripe')(`${process.env.STRIPE_KEY}`);
const fs = require('fs');

// 1. Create a new listing
exports.createListing = async (req, res) => {
    console.log('#createListing')
    try {
        const {
            title,
            description,
            type,
            plan,
            price,
            typeOfSpace,
            location,
            dimensions,
            amenities,
            vehicleType,
            spaceType
        } = req.body;

        // Parse and validate location
        const parsedLocation = {
            address: location?.address?.trim() || '',
            coordinates: [
                parseFloat(location?.coordinates?.[0]) || 0, // Default to 0 if parsing fails
                parseFloat(location?.coordinates?.[1]) || 0  // Default to 0 if parsing fails
            ]
        };

        // Parse and validate dimensions
        const parsedDimensions = {
            length: parseFloat(dimensions?.length) || 0,
            width: parseFloat(dimensions?.width) || 0,
            height: dimensions?.height ? parseFloat(dimensions.height) : undefined
        };

        // Handle amenities as an array of strings
        const parsedAmenities = Array.isArray(amenities)
            ? amenities.map(a => a.trim()).filter(Boolean) // Trim and filter empty values
            : [];

        // Handle photos if files are uploaded
        const photos = req.files
            ? req.files.map(file => file.path.replace(/^public\//, ''))
            : [];


        // Create a new listing object
        const listing = new Listing({
            owner: req.user.id, // Assume authenticated user's ID is available in `req.user`
            title: title?.trim(),
            description: description?.trim(),
            type: type?.trim(),
            plan: plan?.trim(),
            price: price?.trim(),
            typeOfSpace: typeOfSpace?.trim(),
            location: parsedLocation,
            dimensions: parsedDimensions,
            amenities: parsedAmenities,
            vehicleType: vehicleType?.trim(),
            spaceType: spaceType?.trim(),
            photos
        });

        // Save the listing to the database
        await listing.save();

        res.status(201).json({
            success: true,
            message: 'Listing created successfully',
            listing
        });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the listing',
            error: error.message
        });
    }
};

exports.getUserAddresses = async (req, res) => {
    try {
        // Extract owner ID from request parameters or user session
        const ownerId = req.user.id; // Assume user is authenticated and owner ID is available

        // Find all listings for the specified owner
        const listings = await Listing.find({ owner: ownerId })
            .populate('owner')
            .sort({ createdAt: -1 });
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


exports.getAddressByUserLocation = async (req, res) => {
    try {
        // Extract owner ID from request parameters or user session
        const ownerId = req.user.id; // Assume user is authenticated and owner ID is available

        const userInfo = await User.findById(ownerId)

        console.log('userInfo', userInfo)
        console.log('userInfo preference', userInfo.preference)

        // Find all listings for the specified owner
        const listings = await Listing.find({ "$and": [{ ownerId }, { type: userInfo.preference }] })
            .populate('owner')
            .sort({ createdAt: -1 });
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
        const listings = await Listing.find({})
            .populate('owner')
            .sort({ createdAt: -1 });
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
        const listings = await Listing.find({}).populate('owner').sort({ createdAt: -1 }).skip(skip).limit(limit);
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
        const listings = await Listing.find({ _id: listingId }).populate({
            path: 'owner',
            select: '_id name' // Specify the fields you want to include
        });

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
        const favoriteAddresses = user.favorites.map(listing => listing);

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
            listing.photos = req.files.map(file => file.path.replace(/^public\//, ''));
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


exports.updateListing = async (req, res) => {
    console.log('#updateListing');
    try {
        const { id } = req.params; // Get listing ID from URL parameters
        const {
            title,
            description,
            type,
            plan,
            price,
            typeOfSpace,
            location,
            dimensions,
            amenities,
            vehicleType,
            spaceType, status
        } = req.body;

        // Find the existing listing to handle photo deletion if needed
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'Listing not found'
            });
        }

        // Parse and validate location
        const parsedLocation = location ? {
            address: location?.address?.trim() || '',
            coordinates: [
                parseFloat(location?.coordinates?.[0]) || 0, // Default to 0 if parsing fails
                parseFloat(location?.coordinates?.[1]) || 0  // Default to 0 if parsing fails
            ]
        } : undefined;

        // Parse and validate dimensions
        const parsedDimensions = dimensions ? {
            length: parseFloat(dimensions?.length) || 0,
            width: parseFloat(dimensions?.width) || 0,
            height: dimensions?.height ? parseFloat(dimensions.height) : undefined
        } : undefined;

        // Handle amenities as an array of strings
        const parsedAmenities = Array.isArray(amenities)
            ? amenities.map(a => a.trim()).filter(Boolean) // Trim and filter empty values
            : undefined;

        // Handle photos if files are uploaded
        if (req.files && req.files.length > 0) {
            // Delete old photos from the file system
            listing.photos.forEach(photoPath => {
                fs.unlink(photoPath, (err) => {
                    if (err) console.error(`Failed to delete old photo at ${photoPath}:`, err);
                });
            });

            // Add new photos
            listing.photos = req.files.map(file => file.path.replace(/^public\//, ''));
        }

        console.log('typeOfSpace', typeOfSpace)
        // Validate required fields
        // const { error, value } = rentalListingSchema.validate({
        //     title,
        //     description,
        //     type,
        //     plan,
        //     price,
        //     typeOfSpace,
        //     location,
        //     dimensions,
        //     amenities,
        //     vehicleType,
        //     spaceType,
        //     status // Optional field
        // });

        // if (error) {
        //     return res.status(400).json({
        //         error: error.details[0].message,
        //     });
        // }

        // Construct the update object
        const updateData = {
            ...(title && { title: title.trim() }),
            ...(description && { description: description.trim() }),
            ...(type && { type: type.trim() }),
            ...(plan && { plan: plan.trim() }),
            ...(price && { price: price.trim() }),
            ...(typeOfSpace && { typeOfSpace: typeOfSpace.trim() }),
            ...(location && { location: parsedLocation }),
            ...(dimensions && { dimensions: parsedDimensions }),
            ...(parsedAmenities && { amenities: parsedAmenities }),
            ...(vehicleType && { vehicleType: vehicleType.trim() }),
            ...(spaceType && { spaceType: spaceType.trim() }),
            ...(req.files && req.files.length > 0 && { photos: listing.photos }) // Update photos if new ones were uploaded
        };

        // Update the listing in the database
        const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true // Ensure validation runs on the updated data
        });

        res.status(200).json({
            success: true,
            message: 'Listing updated successfully',
            listing: updatedListing
        });
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the listing',
            error: error.message
        });
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


function haversine(lat1, lon1, lat2, lon2) {
    const R = 3959; // Radius of the Earth in miles
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in miles
}


function markFavorites(listings, favorites) {
    // Create a Set from the favorites array for faster lookup
    const favoritesSet = new Set(favorites);

    // Iterate through each listing and add the isFavorite attribute
    const updatedListing = listings.map(listing => {
        // Convert Mongoose document to plain object
        const plainListing = listing.toObject ? listing.toObject() : listing; // Check if toObject exists

        return {
            ...plainListing, // Spread the existing listing properties
            isFavorite: favorites.includes(plainListing._id) // Check if the listing ID is in the favorites set
        };
    });


    return updatedListing;
}


function filterByPlanType(listings, type) {
    const updatedListingByPlan = listings.filter(listing => listing.type == type);
    return updatedListingByPlan;
}

exports.getListingsWithinRadius = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const radiusInMiles = 12;

        const latitude = user.latitude
        const longitude = user.longitude

        // Validate inputs
        if (!latitude || !longitude || !radiusInMiles) {
            return res.status(400).json({
                success: false,
                message: "Please provide latitude, longitude, and radiusInMiles.",
            });
        }

        // Log the coordinates being passed
        console.log("Querying listings around coordinates:", [longitude, latitude]);

        // Fetch all listings
        const listings = await Listing.find();

        // Filter listings based on distance using Haversine formula
        const nearbyListings = listings.filter(listing => {
            const listingLat = listing.location.coordinates[1]; // latitude
            const listingLon = listing.location.coordinates[0]; // longitude
            const distance = haversine(latitude, longitude, listingLat, listingLon);
            return distance <= radiusInMiles;
        });

        // Check if any listings are found
        if (nearbyListings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No listings found within the specified radius.",
            });
        }


        const updatedListings = markFavorites(nearbyListings, user.favorites);
        const filterByPlan = filterByPlanType(updatedListings, user.preference);


        return res.status(200).json({
            success: true,
            listings: filterByPlan
        });
    } catch (error) {
        console.error('Error in getListingsWithinRadius:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching listings.",
        });
    }
};
