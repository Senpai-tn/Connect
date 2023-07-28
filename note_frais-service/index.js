const express = require('express')
const app = express()
const router = require('./routes')
const { connect } = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const https = require('https')
const fs = require('fs')
const server = https.createServer(
  {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
  },
  app
)
app.use(express.json())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
connect(
  'mongodb+srv://user18:arwxcjkytqQegca6@cluster0.aykhi.mongodb.net/Connect?authMechanism=DEFAULT'
).then(() => {
  console.log('note_frais connected To DB')
})
app.get('/', (req, res) => {
  res.send('note frais service')
})
app.use('/', router)
server.listen(5005, () => {
  console.log('note_frais started')
})
