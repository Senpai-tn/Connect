const express = require('express')
const cors = require('cors')
const app = express()
const default_proxy = require('express-http-proxy')
require('dotenv').config()
const path = require('path')
const http = require('http')
const fs = require('fs')
const axios = require('axios')
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
app.use(express.json())

app.options('*', cors())

app.use(cors())

const { verifToken } = require('./tokenMiddleware')

const isMultipartRequest = function (req) {
  const contentTypeHeader = req.headers['content-type']
  return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1
}

const proxy = function (host) {
  return function (req, res, next) {
    if (isMultipartRequest(req)) {
      return default_proxy(host, {
        reqAsBuffer: true,
        reqBodyEncoding: null,
        parseReqBody: false,
      })(req, res, next)
    } else return default_proxy(host)(req, res, next)
  }
}
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/auth', proxy('http://localhost:5001'))
app.use('/api/users', proxy('http://localhost:5002'))
app.use('/api/entreprises', proxy('http://localhost:5003'))
app.use('/api/variables', proxy('http://localhost:5004'))
app.use('/api/note_frais', proxy('http://localhost:5005'))

app.get('/', (req, res) => {
  res.send(
    'main route <br/>/api/users<br/>/api/entreprises <br/>/api/variables <br/>/api/note_frais'
  )
})
io.sockets.on('connection', function (socket) {
  socket.on('setId', (data) => {
    if (data.user !== null)
      axios
        .put(`http://localhost:5000/api/users/${data.user._id}`, {
          ...data.user,
          socketID: socket.id,
        })
        .then((response) => {
          socket.emit('updateUser', { user: response.data })
        })
        .catch((error) => {
          console.log(error)
        })
  })
})
app.post('/', async (req, res) => {
  /**
   * #swagger.tags = ['Envoyer notif']
   */
  try {
    const {
      reciever,
      sender,
      content,
      type,
      saveNotif = true,
      event,
    } = req.body

    io.to(reciever.socketID || null).emit(event, {
      reciever,
      sender,
      content,
      type,
      saveNotif,
      event,
    })
    res.send('send')
  } catch (error) {
    res.status(503).send({ message: error.message })
  }
})
server.listen(5000, () => {
  console.log('Secure server is listening on port 5000')
})
