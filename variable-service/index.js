const express = require('express')
const app = express()

const variableRouter = require('./routes')
const { connect } = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
app.use(express.json())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

connect(
  'mongodb+srv://user18:arwxcjkytqQegca6@cluster0.aykhi.mongodb.net/Connect?authMechanism=DEFAULT'
).then(() => {
  console.log('variable connected To DB')
})
app.use('/', variableRouter)
app.listen(5004, () => {
  console.log('variable started')
})
