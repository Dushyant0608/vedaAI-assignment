import Redis from 'ioredis'
import { UPSTASH_REDIS_URL } from './env'

const redis = new Redis(UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: null,
})

redis.on('connect', () => console.log('Redis connected ✅'))
redis.on('error', (err) => console.error('Redis error ❌', err))


export const redisConnectionConfig = {
  url: UPSTASH_REDIS_URL,
  maxRetriesPerRequest: null,
}

export default redis
