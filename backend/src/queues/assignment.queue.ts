import { Queue } from 'bullmq'
import { UPSTASH_REDIS_URL } from '../config/env'

const assignmentQueue = new Queue('assignment-generation', {
  connection: {
    url: UPSTASH_REDIS_URL,
    maxRetriesPerRequest: null,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
})

export default assignmentQueue
