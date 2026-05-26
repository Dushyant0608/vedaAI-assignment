import { Request, Response } from 'express'
import Assignment from '../models/assignment.model'
import assignmentQueue from '../queues/assignment.queue'
import redis from '../config/redis'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'

const CACHE_TTL = 300 // 5 minutes

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { title, fileUrl, dueDate, questionTypes, additionalInstructions } = req.body

  if (!title || !dueDate || !questionTypes?.length) {
    throw new AppError('Title, due date, and at least one question type are required', 400)
  }

  const assignment = await Assignment.create({
    title,
    fileUrl,
    dueDate,
    questionTypes,
    additionalInstructions,
    status: 'pending',
  })

  await assignmentQueue.add('generate', { assignmentId: assignment._id.toString() })

  res.status(202).json({
    success: true,
    data: assignment,
  })
})

export const getAssignments = asyncHandler(async (req: Request, res: Response) => {
  const assignments = await Assignment.find().sort({ createdAt: -1 }).select('-output')

  res.json({
    success: true,
    data: assignments,
  })
})

export const getAssignmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const cached = await redis.get(`assignment:${id}`)
  if (cached) {
    return res.json({
      success: true,
      data: JSON.parse(cached),
    })
  }

  const assignment = await Assignment.findById(id)
  if (!assignment) {
    throw new AppError('Assignment not found', 404)
  }

  if (assignment.status === 'completed') {
    await redis.set(`assignment:${id}`, JSON.stringify(assignment), 'EX', CACHE_TTL)
  }

  res.json({
    success: true,
    data: assignment,
  })
})

export const deleteAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const assignment = await Assignment.findByIdAndDelete(id)
  if (!assignment) {
    throw new AppError('Assignment not found', 404)
  }

  await redis.del(`assignment:${id}`)

  res.json({
    success: true,
    message: 'Assignment deleted',
  })
})

export const regenerateAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const assignment = await Assignment.findById(id)
  if (!assignment) {
    throw new AppError('Assignment not found', 404)
  }

  assignment.status = 'pending'
  assignment.output = undefined as any
  await assignment.save()

  await redis.del(`assignment:${id}`)
  await assignmentQueue.add('generate', { assignmentId: id })

  res.status(202).json({
    success: true,
    data: assignment,
  })
})
