const Booking = require('../models/booking'); // Path may vary based on your file structure
const User = require('../models/users')
const Listing = require('../models/Listing')
const Transaction = require('../models/transaction')

const stripe = require('stripe')(`${process.env.STRIPE_KEY}`);

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

        // Retrieve user and listing info from the database
        const userInfo = await User.findById(userId);
        const listInfo = await Listing.findById(listingId);

        const connectedAccountId = userInfo.stripeAccountId;


        // console.log('userInfo', userInfo)
        // Create the Stripe checkout session with metadata
        const session = await stripe.checkout.sessions.create(
            {
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: listInfo.title, // Product name from the listing
                            },
                            unit_amount: 7500, // Example price in cents (1 USD)
                        },
                        quantity: 1,
                    },
                ],
                payment_intent_data: {
                    application_fee_amount: 5000, // Example application fee (in cents)
                },
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}/login`, // Redirect after payment success
                cancel_url: `${process.env.CLIENT_URL}/cancel`, // Redirect after payment cancellation
                metadata: {
                    fullname: fullname.trim(),
                    phoneNumber: phoneNumber.trim(),
                    vehicleNumber: vehicleNumber.trim(),
                    fromDate: fromDate.trim(),
                    toDate: toDate.trim(),
                    time: time.trim(),
                    listingId: listingId,
                    userId: userId, // Link to the user who made the booking
                }
            },
            {
                stripeAccount: connectedAccountId, // Connected account for marketplace payments
            }
        );


        // Create the booking object
        const booking = await Booking.create({
            fullname,
            phoneNumber,
            vehicleNumber,
            fromDate,
            toDate,
            time,
            listingId: listInfo._id,
            userId: userId,
            status: 'pending',
            paymentStatus: 'pending',
        });

        console.log('booking', booking)
        // Return the session ID to the client so they can complete the payment
        res.status(200).json({
            success: true,
            message: 'Payment session created, proceed to payment.',
            stripeSessionId: session.id, // Send session ID to the client for payment redirection
            connectedAccountId
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};




// Stripe webhook handler
module.exports.webhook = async (request, response) => {
    console.log('#webhook')
    const event = request.body;

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                console.log('checkout.session.completed');

                // Retrieve the invoice from the event data
                const invoice = await stripe.invoices.retrieve(event.data.object.invoice);
                console.log('Invoice Retrieved:', invoice);

                // Extract necessary details from the session object
                const session = event.data.object;
                const userId = session.client_reference_id;  // Use the client_reference_id to link to the user

                // Assuming the metadata contains the booking information
                const { fullname, phoneNumber, vehicleNumber, fromDate, toDate, time, listingId } = session.metadata;

                // Retrieve the user information from the database
                const userInfo = await User.findById(userId);
                const listInfo = await Listing.findById(listingId);

                const booking = await Booking.findOne({ userId, listingId, status: 'pending' });
                console.log('webhookcbooking', booking);
                console.log('session', session);

                console.log('userId', userId);



                // If no booking is found, exit
                if (!booking) {
                    return response.status(400).json({ success: false, message: 'Booking not found or already processed.' });
                }

                // Update the booking with payment and status changes
                booking.status = 'confirmed'; // Set status to confirmed after payment success
                booking.paymentStatus = 'succeeded'; // Mark the payment as successful

                // Save the updated booking in the database
                await booking.save();

                // Save the booking in the database

                // Now, prepare and save the payment transaction data
                const paymentData = preparePaymentData(session);

                // Save payment transaction data
                const transaction = new Transaction({
                    transactionId: session.payment_intent,
                    date: new Date(),
                    customerName: userInfo.fullname,
                    customerPhoneNumber: phoneNumber.trim(),
                    hostName: listInfo.hostName,
                    listingId: listInfo._id,
                    listingTitle: listInfo.title,
                    amount: session.amount_total / 100, // Convert amount to the main currency unit (e.g., USD)
                    paymentStatus: 'succeeded',  // Assuming payment succeeded
                    paymentMethod: session.payment_method_types[0] || 'Unknown',  // Stripe payment method
                    stripeSessionId: session.id, // Reference to Stripe session ID
                    userId: userId,  // Link the transaction to the user
                    metadata: session.metadata,  // Store any metadata from the session
                });

                // Save the payment transaction in the database
                await transaction.save();

                return response.status(200).json({ success: true, message: 'Booking and payment transaction saved successfully' });

            default:
                console.log(`Unhandled event type ${event.type}`);
                return response.status(200).json({ success: true, message: 'Event received' });
        }
    } catch (error) {
        console.error('Webhook error:', error);
        return response.status(500).json({ success: false, message: error.message });
    }
};

// Helper function to prepare payment data (adjust as needed)
function preparePaymentData(session) {
    return {
        paymentIntentId: session.payment_intent,
        amountReceived: session.amount_total / 100,  // Convert to main currency unit
        paymentStatus: session.payment_status,
        userId: session.client_reference_id,
    };
}

module.exports.test = async (req, res) => {
    try {
        const result = await User.updateMany(
            { email: { $ne: 'admin@gmail.com' } },
            { $set: { isDeleted: false } }
        );


        return res.status(200).json({
            success: true,
            message: "All user records have been updated to isDeleted: false",
            data: {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount
            }
        });
    } catch (error) {
        console.error("Error while trying to update users-------", error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

