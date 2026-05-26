import axios from 'axios'
import type { Assignment } from '../types'

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
})

export const createAssignment = (data: {
  title: string
  dueDate: string
  questionTypes: { type: string; numberOfQuestions: number; marks: number }[]
  additionalInstructions?: string
  fileUrl?: string
}) => API.post<{ success: boolean; data: Assignment }>('/assignments', data)

export const getAssignments = () =>
  API.get<{ success: boolean; data: Assignment[] }>('/assignments')

export const getAssignmentById = (id: string) =>
  API.get<{ success: boolean; data: Assignment }>(`/assignments/${id}`)

export const deleteAssignment = (id: string) =>
  API.delete<{ success: boolean; message: string }>(`/assignments/${id}`)

export const regenerateAssignment = (id: string) =>
  API.post<{ success: boolean; data: Assignment }>(`/assignments/${id}/regenerate`)