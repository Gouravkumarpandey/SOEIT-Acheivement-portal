const axios = require('axios');

/**
 * Send push notifications via Expo
 * @param {string[]} pushTokens - Array of Expo push tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data to send
 */
const sendPushNotification = async (pushTokens, title, body, data = {}) => {
    if (!pushTokens || pushTokens.length === 0) return;

    // Filter out invalid tokens
    const validTokens = pushTokens.filter(token => token && token.startsWith('ExponentPushToken'));
    if (validTokens.length === 0) return;

    const messages = validTokens.map(token => ({
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: data,
    }));

    try {
        await axios.post('https://exp.host/--/api/v2/push/send', messages, {
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
        });
        console.log(`Push notification sent to ${validTokens.length} devices`);
    } catch (error) {
        console.error('Error sending push notification:', error.response ? error.response.data : error.message);
    }
};

module.exports = {
    sendPushNotification,
};
