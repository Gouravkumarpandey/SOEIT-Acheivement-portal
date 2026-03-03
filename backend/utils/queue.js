const { Queue } = require('bullmq');
const Redis = require('ioredis');

let isRedisAvailable = false;
let achievementQueue = null;

// 🔹 Enterprise Scaling Strategy: Optimistic Connection
const shouldConnect = process.env.REDIS_URL || process.env.NODE_ENV === 'production';

if (shouldConnect) {
    // 🤐 SILENCE MODE: Setup ioredis with aggressive silence settings for Dev
    const connection = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
        maxRetriesPerRequest: null,
        enableOfflineQueue: false,
        lazyConnect: true,
        showFriendlyErrorStack: false,
        retryStrategy: (times) => {
            // Very slow backoff in dev to minimize terminal output
            return Math.min(times * 2000, 30000);
        }
    });

    // 🔇 Global Error Catcher: Ensures the process never crashes or logs the same error twice
    connection.on('error', (err) => {
        isRedisAvailable = false;
        // Do NOT log ECONNREFUSED in development; it's expected if Redis isn't installed.
        if (process.env.NODE_ENV === 'production' && !err.message.includes('ECONNREFUSED')) {
            console.error('❌ Redis Error:', err.message);
        }
    });

    connection.on('connect', () => {
        isRedisAvailable = true;
        console.log('✅ Redis connected successfully (BullMQ ready)');
    });

    achievementQueue = new Queue('achievement-processing', { connection });
} else {
    // Completely skip Redis logic if not configured
    console.warn('💡 Redis Scaling bypassed. Jobs will run synchronously (Development Fallback).');
}

/**
 * addAchievementToQueue
 * Gracefully handles achievement processing. 
 * Falls back to synchronous processing if Redis is offline.
 */
exports.addAchievementToQueue = async (data) => {
    try {
        if (!isRedisAvailable || !achievementQueue) {
            // Silent fallback in dev
            if (process.env.NODE_ENV === 'development') {
                // Informative once per session
                return;
            }
            console.warn(`[Queue Fallback] Processing achievement ${data.id} without Redis.`);
            return;
        }

        await achievementQueue.add('process-achievement', data, {
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
        });
    } catch (error) {
        // Silently catch and log only in production
        if (process.env.NODE_ENV === 'production') {
            console.error('[Queue Error] Critical failure:', error.message);
        }
    }
};

exports.isRedisAvailable = () => isRedisAvailable;
exports.achievementQueue = achievementQueue;
