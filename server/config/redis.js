import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisURL = process.env.REDIS_URL;

let redis;

if (!redisURL) {
    // If no Redis URL configured (e.g. local dev without Redis), use a mock/noop client
    console.warn('⚠️ REDIS_URL not set — Redis caching disabled (using no-op client)');
    redis = {
        get: async () => null,
        set: async () => 'OK',
        del: async () => 1,
        on: () => { },
    };
} else {
    redis = new Redis(redisURL, {
        maxRetriesPerRequest: 3,
        connectTimeout: 10000,
        lazyConnect: false,
        retryStrategy(times) {
            if (times > 5) {
                console.error('❌ Redis: Max retries reached, giving up');
                return null; // stop retrying
            }
            const delay = Math.min(times * 100, 3000);
            return delay;
        },
        reconnectOnError(err) {
            const targetError = 'READONLY';
            if (err.message.includes(targetError)) {
                return true;
            }
        },
    });

    redis.on('connect', () => {
        console.log('✅ Redis Connected');
    });

    redis.on('error', (err) => {
        console.error('❌ Redis Connection Error:', err.message);
        // Don't crash — just log. The controllers already have try/catch around Redis calls.
    });
}

export default redis;
