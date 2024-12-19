const Joi = require('joi');

// Define the user schema
const userSchema = Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must be at least 1 character long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required',
    }),
    deviceId: Joi.string().optional().messages({}),
    latitude: Joi.string().required().messages({
        'string.empty': 'latitude cannot be empty',
    }),
    longitude: Joi.string().required().messages({
        'string.empty': 'longitude cannot be empty',
    }),
    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) // At least one letter, one number, and one special character
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must not exceed 128 characters',
            'string.pattern.base': 'Password must contain at least one letter, one number, and one special character',
            'any.required': 'Password is required',
        }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': 'Confirm password must match password',
        'any.required': 'Confirm password is required',
    }),
    phoneNumber: Joi.string().custom((value, helpers) => {
        // Check if the contact number starts with a '+'
        if (!value.startsWith('+')) {
            return helpers.error('any.invalid'); // Not valid if it doesn't start with '+'
        }

        // Validate the overall length of the contact number
        if (value.length < 10 || value.length > 15) {
            return helpers.error('string.length'); // Error for length
        }

        // Validate the regex pattern
        const pattern = /^\+\d{1,3}\d{7,14}$/;
        if (!pattern.test(value)) {
            return helpers.error('string.pattern.base'); // Error for invalid format
        }

        return value; // Return the value if all checks pass
    }).messages({
        'any.invalid': 'Please enter a contact number starting with a valid country code (e.g., +1 for the USA).',
        'string.length': 'The contact number must be between 10 and 15 digits long, including the country code.',
        'string.pattern.base': 'The contact number should follow the format +[country_code][number] (e.g., +441234567890).'
    }),

});


const updateUserSchema = Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must be at least 1 character long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required',
    }),
    phoneNumber: Joi.string().custom((value, helpers) => {
        // Check if the contact number starts with a '+'
        if (!value.startsWith('+')) {
            return helpers.error('any.invalid'); // Not valid if it doesn't start with '+'
        }

        // Validate the overall length of the contact number
        if (value.length < 10 || value.length > 15) {
            return helpers.error('string.length'); // Error for length
        }

        // Validate the regex pattern
        const pattern = /^\+\d{1,3}\d{7,14}$/;
        if (!pattern.test(value)) {
            return helpers.error('string.pattern.base'); // Error for invalid format
        }

        return value; // Return the value if all checks pass
    }).messages({
        'any.invalid': 'Please enter a contact number starting with a valid country code (e.g., +1 for the USA).',
        'string.length': 'The contact number must be between 10 and 15 digits long, including the country code.',
        'string.pattern.base': 'The contact number should follow the format +[country_code][number] (e.g., +441234567890).'
    }),

});

const signInSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required',
    }),
    deviceId: Joi.string().optional().messages({}),
    latitude: Joi.string().allow('').optional().messages({
        'string.empty': 'latitude cannot be empty',
    }),
    longitude: Joi.string().allow('').optional().messages({
        'string.empty': 'longitude cannot be empty',
    }),
});


const emailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required',
    }),
});

const passwordSchema = Joi.object({
    newPassword: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) // At least one letter, one number, and one special character
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must not exceed 128 characters',
            'string.pattern.base': 'Password must contain at least one letter, one number, and one special character',
            'any.required': 'Password is required',
        }),
});

const updateProfileSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional().messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be empty',
        'string.alphanum': 'Username must only contain letters and numbers',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must not exceed 30 characters',
    }),
    bio: Joi.string().max(160).messages({
        'string.base': 'Bio must be a string',
        'string.max': 'Bio cannot exceed 160 characters', // 160 is a common standard for short bios (e.g., Twitter)
    }),
    contactNumber: Joi.string().custom((value, helpers) => {
        // Check if the contact number starts with a '+'
        if (!value.startsWith('+')) {
            return helpers.error('any.invalid'); // Not valid if it doesn't start with '+'
        }

        // Validate the overall length of the contact number
        if (value.length < 10 || value.length > 15) {
            return helpers.error('string.length'); // Error for length
        }

        // Validate the regex pattern
        const pattern = /^\+\d{1,3}\d{7,14}$/;
        if (!pattern.test(value)) {
            return helpers.error('string.pattern.base'); // Error for invalid format
        }

        return value; // Return the value if all checks pass
    }).messages({
        'any.invalid': 'Please enter a contact number starting with a valid country code (e.g., +1 for the USA).',
        'string.length': 'The contact number must be between 10 and 15 digits long, including the country code.',
        'string.pattern.base': 'The contact number should follow the format +[country_code][number] (e.g., +441234567890).'
    }),
    hashTags: Joi.array().items(
        Joi.string().pattern(/^#[a-zA-Z0-9_]+$/).max(30).messages({
            'string.pattern.base': 'Each hashtag must start with a # and contain only letters, numbers, and underscores',
            'string.max': 'Hashtag cannot exceed 30 characters',
        })
    ).max(10).messages({
        'array.base': 'Hashtags must be an array of strings',
        'array.max': 'You cannot provide more than 10 hashtags',
    }),
});


// Define the create story schema
const createStorySchema = Joi.object({
    mediaType: Joi.string().valid('image', 'video').required().messages({
        'any.only': 'Media type must be either image or video',
        'any.required': 'Media type is required',
    }),
    promotionExpiry: Joi.date().greater('now').optional().messages({
        'date.base': 'Promotion expiry must be a valid date',
        'date.greater': 'Promotion expiry must be a future date',
        'any.required': 'Promotion expiry is required',
    }),
    caption: Joi.string().max(2200).allow(null, '').optional().messages({
        'string.max': 'Caption cannot exceed 2200 characters',
    }),
});



const rentalListingSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required.',
        'any.required': 'Title is required.',
    }),
    description: Joi.string().min(1).required().messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is required.',
        'any.required': 'Description is required.',
    }),
    type: Joi.string().valid('Parking', 'Storage').required().messages({
        'any.only': 'Type must be either "Parking" or "Storage".',
        'any.required': 'Type is required.',
    }),
    plan: Joi.string().valid('hourly', 'daily', 'monthly', 'yearly').required().messages({
        'any.only': 'Plan must be one of "hourly", "daily", "monthly", or "yearly".',
        'any.required': 'Plan is required.',
    }),
    price: Joi.number().greater(0).required().messages({
        'number.base': 'Price must be a number.',
        'number.greater': 'Price must be greater than zero.',
        'any.required': 'Price is required.',
    }),
    typeOfSpace: Joi.string().valid('Indoor', 'Outdoor').required().messages({
        'any.only': 'Type of space must be either "Indoor" or "Outdoor".',
        'any.required': 'Type of space is required.',
    }),
    location: Joi.object({
        address: Joi.string().min(1).required().messages({
            'string.base': 'Location address must be a string.',
            'string.empty': 'Location address is required.',
            'any.required': 'Location address is required.',
        }),
        coordinates: Joi.array().items(Joi.number().required()).length(2).required().messages({
            'array.base': 'Coordinates must be an array of numbers.',
            'array.length': 'Coordinates must contain exactly two numbers.',
            'any.required': 'Coordinates are required.',
        }),
    }).required().messages({
        'object.base': 'Location must be an object.',
        'any.required': 'Location is required.',
    }),
    dimensions: Joi.object({
        length: Joi.number().greater(0).required().messages({
            'number.base': 'Length must be a number.',
            'number.greater': 'Length must be greater than zero.',
            'any.required': 'Length is required.',
        }),
        width: Joi.number().greater(0).required().messages({
            'number.base': 'Width must be a number.',
            'number.greater': 'Width must be greater than zero.',
            'any.required': 'Width is required.',
        }),
        height: Joi.number().greater(0).optional().messages({
            'number.base': 'Height must be a number.',
            'number.greater': 'Height must be greater than zero.',
        }),
    }).required().messages({
        'object.base': 'Dimensions must be an object.',
        'any.required': 'Dimensions are required.',
    }),
    amenities: Joi.array().items(Joi.string().valid(
        'ClimateControlled',
        'SmokeDetectors',
        'PetFree',
        'SmokeFree',
        'PrivateSpace',
        'SecurityCamera'
    )).optional().messages({
        'array.base': 'Amenities must be an array of valid options.',
    }),
    vehicleType: Joi.string().valid('Compact', 'Standard', 'RV', 'Boat', 'LargeVehicles', 'Motorcycle').required().messages({
        'any.only': 'Vehicle type must be one of "Compact", "Standard", "RV", "Boat", "LargeVehicles", or "Motorcycle".',
        'any.required': 'Vehicle type is required.',
    }),
    spaceType: Joi.string().valid('Residential', 'Commercial').required().messages({
        'any.only': 'Space type must be either "Residential" or "Commercial".',
        'any.required': 'Space type is required.',
    }),
    status: Joi.string().valid('Available', 'RentOut').optional().messages({
        'any.only': 'Status must be either "Available" or "RentOut".',
    }),
});




module.exports = { rentalListingSchema, createStorySchema, userSchema, updateUserSchema, signInSchema, emailSchema, passwordSchema, updateProfileSchema };
