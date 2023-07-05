const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const authRouter = require('./routes/auth')
const entrepriseRouter = require('./routes/listeEntreprise')
require('dotenv').config()

const { connect } = require('mongoose')
connect(
  'mongodb+srv://user18:arwxcjkytqQegca6@cluster0.aykhi.mongodb.net/Connect?authMechanism=DEFAULT'
).then(() => {
  console.log('Users connected To DB')
})
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/', authRouter)
app.use('/entreprise', entrepriseRouter)
app.listen(5002, () => {
  console.log('users service started')
})
