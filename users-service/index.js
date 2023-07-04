const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const authRouter = require('./routes/auth')
const entrepriseRouter = require('./routes/listeEntreprise')
require('dotenv').config()

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Connect').then(() => {
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
