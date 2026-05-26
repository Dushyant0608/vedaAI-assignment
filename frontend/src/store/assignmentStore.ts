import { create } from 'zustand'
import type { Assignment } from '../types'
import * as api from '../api/assignments'

interface AssignmentStore {
  assignments: Assignment[]
  current: Assignment | null
  loading: boolean
  error: string | null
  fetchAssignments: () => Promise<void>
  fetchAssignment: (id: string) => Promise<void>
  createAssignment: (data: Parameters<typeof api.createAssignment>[0]) => Promise<Assignment>
  deleteAssignment: (id: string) => Promise<void>
  regenerateAssignment: (id: string) => Promise<void>
  updateAssignment: (assignment: Assignment) => void
}

const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: [],
  current: null,
  loading: false,
  error: null,

  fetchAssignments: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.getAssignments()
      set({ assignments: res.data.data, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  fetchAssignment: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const res = await api.getAssignmentById(id)
      set({ current: res.data.data, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  createAssignment: async (data) => {
    const res = await api.createAssignment(data)
    const assignment = res.data.data
    set((state) => ({ assignments: [assignment, ...state.assignments] }))
    return assignment
  },

  deleteAssignment: async (id: string) => {
    await api.deleteAssignment(id)
    set((state) => ({
      assignments: state.assignments.filter((a) => a._id !== id),
      current: state.current?._id === id ? null : state.current,
    }))
  },

  regenerateAssignment: async (id: string) => {
    const res = await api.regenerateAssignment(id)
    set({ current: res.data.data })
  },

  updateAssignment: (assignment: Assignment) => {
    set((state) => ({
      current: state.current?._id === assignment._id ? assignment : state.current,
      assignments: state.assignments.map((a) =>
        a._id === assignment._id ? assignment : a
      ),
    }))
  },
}))

export default useAssignmentStore
