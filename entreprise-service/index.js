const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const { connect } = require('mongoose')
const router = require('./routes')

connect(
  // 'mongodb://127.0.0.1:27017/En'
  'mongodb+srv://user18:arwxcjkytqQegca6@cluster0.aykhi.mongodb.net/Connect?authMechanism=DEFAULT'
).then(() => {
  console.log('Entreprise connected To DB')
})
const cors = require('cors')
const { Server } = require('socket.io')

app.use(express.json())
app.use(cors())
app.use('/', router)
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(5003, () => {
  console.log('entreprise service started')
})
