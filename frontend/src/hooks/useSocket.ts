import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import useAssignmentStore from '../store/assignmentStore'

const useSocket = (assignmentId: string | undefined) => {
  const socketRef = useRef<Socket | null>(null)
  const fetchAssignment = useAssignmentStore((s) => s.fetchAssignment)

  useEffect(() => {
    if (!assignmentId) return

    const socket = io(import.meta.env.VITE_API_URL)
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join-assignment', assignmentId)
    })

    socket.on('status-update', (data: { assignmentId: string; status: string }) => {
      if (data.assignmentId === assignmentId) {
        fetchAssignment(assignmentId)
      }
    })

    return () => {
      socket.emit('leave-assignment', assignmentId)
      socket.disconnect()
    }
  }, [assignmentId, fetchAssignment])
}

export default useSocket