const notification = require('../models/notification');
const Notification = require('../models/notification');
const axios = require('axios'); // For HTTP requests

const OneSignal = require('@onesignal/node-onesignal');
const { ONESIGNAL_APP_ID, ONE_SIGNAL_API_KEY } = process.env;


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
        // Send response with updated notifications or all notifications if no updates

        res.status(200).json({
            ...(markAsRead === 'true' ? { Notifications: updatedNotifications } : { Notifications: allNotifications }),
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



const configuration = OneSignal.createConfiguration({
    authMethods: {
        app_key: {
            tokenProvider: {
                getToken: () => ONE_SIGNAL_API_KEY,
            },
        },
    },
});
const client = new OneSignal.DefaultApi(configuration);

const sendNotification = async (req, res) => {
    try {
        const { deviceId, message } = req.body;

        if (!deviceId || !message) {
            return res.status(400).json({ message: "Device ID and message are required." });
        }

        const notification = new OneSignal.Notification();
        notification.app_id = ONESIGNAL_APP_ID;
        notification.include_subscription_ids = [deviceId],
            notification.contents = { en: message };
        const { id } = await client.createNotification(notification);

        res.json({ success: true, message: "Notification sent successfully!", id });
    } catch (error) {
        console.error('Error sending notification:', error.response?.data || error.message);
        return res.status(500).json({ message: "Failed to send notification", error: error.message });
    }
};

const sendPushNotificationNew = async (req, res) => {
    try {
        const { message, deviceId } = req.body;
        const title = "US Plaza";
        // Payload for OneSignal
        const payload = {
            app_id: ONESIGNAL_APP_ID,
            include_subscription_ids: [deviceId],
            headings: { en: title },
            contents: { en: message },
            data: {}, // Add any custom data if needed
        };

        // Send push notification
        const response = await axios.post('https://onesignal.com/api/v1/notifications', payload, {
            headers: {
                Authorization: `Basic ${ONE_SIGNAL_API_KEY}`, // Replace with your OneSignal API key
                'Content-Type': 'application/json',
            },
        });

        res.status(200).json({
            success: true,
            message: "Notification sent successfully.",
            oneSignalResponse: response.data,
        });

    } catch (error) {
        console.error("Error sending push notification:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
};


module.exports = { checkNotification, sendNotification, sendPushNotificationNew };

