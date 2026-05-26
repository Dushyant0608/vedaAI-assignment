import { Worker, Job } from 'bullmq'
import { UPSTASH_REDIS_URL } from '../config/env'
import redis from '../config/redis'
import Assignment from '../models/assignment.model'
import { generateQuestionPaper } from '../services/gemini.service'
import { getIO } from '../socket'

const emitStatus = (assignmentId: string, status: string, data?: any) => {
  try {
    const io = getIO()
    io.to(`assignment:${assignmentId}`).emit('status-update', { assignmentId, status, data })
  } catch {
    // socket not initialized yet, skip
  }
}

const worker = new Worker(
  'assignment-generation',
  async (job: Job) => {
    const { assignmentId } = job.data

    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) throw new Error(`Assignment ${assignmentId} not found`)

    // Set processing
    assignment.status = 'processing'
    await assignment.save()
    emitStatus(assignmentId, 'processing')

    // Generate
    const output = await generateQuestionPaper({
      title: assignment.title,
      questionTypes: assignment.questionTypes,
      additionalInstructions: assignment.additionalInstructions || undefined,
    })

    // Save output
    assignment.set('output', output)
    assignment.status = 'completed'
    await assignment.save()

    // Invalidate cache
    await redis.del(`assignment:${assignmentId}`)

    emitStatus(assignmentId, 'completed', output)
  },
  {
    connection: {
      url: UPSTASH_REDIS_URL,
      maxRetriesPerRequest: null,
    },
    concurrency: 2,
  }
)

worker.on('failed', async (job, err) => {
  if (!job) return
  const { assignmentId } = job.data
  console.error(`Job failed for ${assignmentId}:`, err.message)

  await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' })
  emitStatus(assignmentId, 'failed', { error: err.message })
})

worker.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`)
})

export default worker
