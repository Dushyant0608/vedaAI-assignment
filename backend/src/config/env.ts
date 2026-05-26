import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000
export const MONGODB_URI = process.env.MONGODB_URI as string
export const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL as string
export const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN as string
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string