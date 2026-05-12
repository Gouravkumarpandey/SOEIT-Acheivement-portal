const cron = require('node-cron');
const { awardWeeklyBadges } = require('../modules/badge/badge.controller');

// Schedule tasks to be run on the server.
const initCronJobs = () => {
    // Run every Sunday at 23:59 (11:59 PM)
    cron.schedule('59 23 * * 0', async () => {
        console.log('Running weekly badge calculation CRON job...');
        try {
            // We can create a mock req/res to reuse the controller logic directly
            const req = {};
            const res = {
                status: function(code) { return this; },
                json: function(data) {
                    console.log('Weekly badge calculation result:', data);
                }
            };
            await awardWeeklyBadges(req, res);
        } catch (error) {
            console.error('Error running weekly badge CRON job:', error);
        }
    });
    
    console.log('⏰ Weekly Badge CRON Job initialized');
};

module.exports = { initCronJobs };
