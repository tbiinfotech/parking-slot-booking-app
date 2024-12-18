const stripe = require('stripe')(`${process.env.STRIPE_KEY}`);
const User = require("../models/users");



module.exports.connectAccount = async (req, res) => {

    const { email } = req.body

    try {
        const account = await stripe.accounts.create({
            country: 'US',
            email: email,
            controller: {
                fees: {
                    payer: 'application',
                },
                losses: {
                    payments: 'application',
                },
                stripe_dashboard: {
                    type: 'standard',
                },
            },
        });

        console.log('account :', account)

        return res.status(201).json({ status: 201, success: true, account: account })
    } catch (error) {

        console.log('error')
        return res.status(400).json({ status: 400, success: false, message: error })

    }

}



module.exports.createConnectedAccount = async (req, res) => {
    try {
        // Step 1: Create a new Stripe connected account for the Owner
        const account = await stripe.accounts.create({
            type: 'express', // Use 'express' account type
            capabilities: {
                card_payments: { requested: true },  // Enable card payments
                transfers: { requested: true },      // Enable transfers
            },
            country: 'AT', // Specify the correct country (in your case, Austria)
        });

        console.log('account',account)

        // Step 2: Generate an account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.CLIENT_URL}/login`,   // URL to redirect if user cancels onboarding
            return_url: `${process.env.CLIENT_URL}/onboarding_complete`, // URL to redirect after successful onboarding
            type: 'account_onboarding', // Account onboarding type
        });

        // Step 3: Update the user's record with the Stripe account ID
        const userId = req.user.id;  // Assuming user ID is in req.user object (typically after authentication)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { stripeAccountId: account.id },  // Save the Stripe account ID in your user document
            { new: true }  // Option to return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step 4: Send the onboarding link to the frontend
        res.status(200).json({ url: accountLink.url });

    } catch (error) {
        console.error("Error creating connected account:", error);
        res.status(500).send("Failed to create connected account");
    }
}

module.exports.deleteConnectAccount = async () => {
    try {
        const deleted = await stripe.accounts.del('acct_1032D82eZvKYlo2C');
    } catch (error) {

    }
}