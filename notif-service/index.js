const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.get('/', (req, res) => {
  io.emit('dis', { message: 'Khaled' })
  res.send('send')
})
server.listen(5006, () => {
  console.log('notif started')
})
