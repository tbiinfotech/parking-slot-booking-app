const StripeKeys = require('../models/stripeKeys');

module.exports.saveStripeKeys = async (req, res) => {
    try {
        const { publicKey, secretKey } = req.body;

        // Check if both public and secret keys are provided
        if (!publicKey || !secretKey) {
            return res.status(400).json({
                success: false,
                message: 'Both Stripe public and secret keys are required.',
            });
        }

        // Create a new StripeKeys document
        const stripeKeys = new StripeKeys({
            publicKey,
            secretKey,
        });

        // Save the Stripe keys to the database
        await stripeKeys.save();

        return res.status(200).json({
            success: true,
            message: 'Stripe keys saved successfully.',
            data: stripeKeys,
        });
    } catch (error) {
        console.error('Error while saving Stripe keys:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while saving the keys.',
            error: error.message,
        });
    }
};
