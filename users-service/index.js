const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const authRouter = require('./routes/auth')
const declarationRouter = require('./routes/declaration')

const entrepriseRouter = require('./routes/listeEntreprise')
require('dotenv').config()

const { connect } = require('mongoose')
connect(
  'mongodb+srv://user18:arwxcjkytqQegca6@cluster0.aykhi.mongodb.net/Connect?authMechanism=DEFAULT'
).then(() => {
  console.log('Users connected To DB')
})

app.get('/', (req, res) => res.send('users service'))

app.use(express.json())

app.use('/aron', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/', authRouter)
app.use('/entreprise', entrepriseRouter)
app.use('/declaration', declarationRouter)

app.listen(5002, () => {
  console.log('users service started')
})
