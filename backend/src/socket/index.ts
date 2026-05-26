import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

let io: Server

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('join-assignment', (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`)
    })

    socket.on('leave-assignment', (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`)
    })

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  return io
}

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}
