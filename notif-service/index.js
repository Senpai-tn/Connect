const express = require('express')
const cors = require('cors')
const https = require('https')
const fs = require('fs')
const axios = require('axios')
const { connect } = require('mongoose')
const Notif = require('./models/Notif')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const app = express()

app.use('/aron', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(cors())
app.use(express.json())
const server = https.createServer(
  {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem'),
  },
  app
)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

connect(
  'mongodb+srv://user18:arwxcjkytqQegca6@cluster0.aykhi.mongodb.net/Connect?authMechanism=DEFAULT'
).then(() => {
  console.log('Notif connected To DB')
})

app.post('/search', async (req, res) => {
  try {
    const { filter } = req.body
    const notifs = await Notif.find(filter)
    res.send(notifs)
  } catch (error) {}
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
    const notif = new Notif({ reciever, sender, content, type })
    if (saveNotif) {
      notif.save()
    }
    axios
    io.to(reciever.socketID || null).emit(event, notif)
    res.send('send')
  } catch (error) {
    res.status(503).send({ message: error.message })
  }
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
app.get('/', (req, res) => {
  res.send('notif')
})
server.listen(5006, () => {
  console.log('notif started')
})

module.exports = { io }
