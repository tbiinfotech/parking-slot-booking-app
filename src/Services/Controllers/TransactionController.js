const Transaction = require('../models/transaction');

module.exports.getAllTransactions = async (req, res) => {
    console.log('Fetching all transactions');

    try {
        const transactions = await Transaction.find();
        console.log('Transactions:', transactions);

        return res.status(200).json({
            success: true,
            message: "Transactions fetched successfully",
            response: transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching transactions",
            error: error.message || "Internal Server Error"
        });
    }
};



module.exports.createTransaction = async (req, res) => {
    const { 
        transactionId,
        date,
        customerName,
        customerPhoneNumber,
        hostName,
        listingId,
        listingTitle,
        amount,
        currency,
        paymentStatus,
        bookingStatus,
        paymentMethod,
        paymentDate,
        userId,
        stripeSessionId,
        metadata
    } = req.body;

    try {
        const newTransaction = new Transaction({
            transactionId,
            date: date || new Date(),
            customerName,
            customerPhoneNumber,
            hostName,
            listingId,
            listingTitle,
            amount,
            currency: currency || 'usd',
            paymentStatus: paymentStatus || 'pending',
            bookingStatus: bookingStatus || 'pending',
            paymentMethod,
            paymentDate: paymentDate || new Date(),
            userId,
            stripeSessionId,
            metadata
        });

        await newTransaction.save();

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction: newTransaction
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        
        return res.status(500).json({
            success: false,
            message: "Failed to create transaction",
            error: error.message || "Internal Server Error"
        });
    }
};
