import { createServer } from 'http'
import app from './app'
import connectDB from './config/db'
import { PORT } from './config/env'
import { initSocket } from './socket'
import './workers/assignment.worker'

const httpServer = createServer(app)

const start = async () => {
  await connectDB().then(()=>{
    httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  initSocket(httpServer);
})
  
}

start()

export {httpServer}