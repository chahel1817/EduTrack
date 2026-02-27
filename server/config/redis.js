import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redis = new Redis(redisURL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
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
});

export default redis;
