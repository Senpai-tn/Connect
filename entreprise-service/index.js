const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const { connect } = require('mongoose')
const router = require('./routes')
const https = require('https')
const fs = require('fs')
const server = https.createServer(
  {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
  },
  app
)
connect(
  'mongodb+srv://user18:arwxcjkytqQegca6@cluster0.aykhi.mongodb.net/Connect?authMechanism=DEFAULT'
).then(() => {
  console.log('Entreprise connected To DB')
})

app.use(express.json())

app.use('/', router)
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get('/', (req, res) => {
  res.send('entreprise service')
})
app.listen(5003, () => {
  console.log('entreprise service started')
})
