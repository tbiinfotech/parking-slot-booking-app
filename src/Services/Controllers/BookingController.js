const Booking = require('../models/Booking'); // Path may vary based on your file structure

exports.createBooking = async (req, res) => {
    try {
        const {
            fullname,
            phoneNumber,
            vehicleNumber,
            fromDate,
            toDate,
            time,
            listingId
        } = req.body;

        const userId = req.user.id; // Assuming user ID is available from an authenticated session or token

        // Validate required fields
        if (!fullname || !phoneNumber || !vehicleNumber || !fromDate || !toDate || !time || !listingId || !userId) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Create new booking instance
        const booking = new Booking({
            fullname: fullname.trim(),
            phoneNumber: phoneNumber.trim(),
            vehicleNumber: vehicleNumber.trim(),
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
            time: time.trim(),
            listingId,
            userId
        });

        // Save the booking in the database
        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

