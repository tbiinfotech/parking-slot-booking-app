const notification = require('../models/notification');
const Notification = require('../models/notification');

// exports.getNotifications = async (req, res) => {
//     try {
//         const notifications = await Notification.find({ recipient: req.user.id })
//         res.json(notifications);
//     } catch (error) {
//         return res.status(400).json({ message: error.message })
//     }
// };

// exports.markAsRead = async (req, res) => {
//     console.log('req.user.id', req.user.id)
//     try {
//         await Notification.updateMany(
//             { recipient: req.user.id, isRead: false },
//             { $set: { isRead: true } }
//         );
//         res.json({ success: true, message: "mark as read" });
//     } catch (error) {
//         return res.status(400).json({ message: error.message })
//     }

// };



const checkNotification = async (req, res) => {
    try {
        const { markAsRead } = req.query;
        const userId = req.user.id;
        // Get all notifications for the logged-in user
        const allNotifications = await Notification.find({ recipient: userId });

        // Check if there are unread notifications for the logged-in user


        let updatedNotifications;
        if (markAsRead === 'true') {
            // Mark all unread notifications as read for the logged-in user
            await Notification.updateMany(
                { recipient: userId, isRead: 0 },
                { $set: { isRead: 1 } } // Mark as read
            );

            // Fetch the updated list of notifications after the update
            updatedNotifications = await Notification.find({ recipient: userId });
        }

        const unreadNotifications = await Notification.find({ recipient: userId, isRead: 0 });

        // Send response with updated notifications or all notifications if no update



        res.status(200).json({
            ...(markAsRead === 'true' && { Notifications: updatedNotifications }),
            isRead: unreadNotifications.length > 0 ? false : true,
            success: true,
            status: 200,
            message: unreadNotifications.length > 0
                ? 'You have unread notifications.'
                : 'All notifications are read.',
        });

    } catch (error) {
        console.error('Error in checkNotification:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};



module.exports = { checkNotification };

