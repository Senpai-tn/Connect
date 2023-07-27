const express = require('express')
const cors = require('cors')
const http = require('http')

const { connect } = require('mongoose')
const Notif = require('./models/Notif')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const app = express()
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(cors())
app.use(express.json())
const server = http.createServer(app)
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
    const { reciever, sender, content, type, saveNotif = true } = req.body
    const notif = new Notif({ reciever, sender, content, type })
    if (saveNotif) {
      notif.save()
    }
    io.emit('dis', notif)
    res.send('send')
  } catch (error) {
    res.status(503).send({ message: error.message })
  }
})
server.listen(5006, () => {
  console.log('notif started')
})

module.exports = { io }
