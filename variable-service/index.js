const express = require('express')
const app = express()
const variableRouter = require('./routes')
const { connect } = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

connect('mongodb://127.0.0.1:27017/Connect?authMechanism=DEFAULT').then(() => {
  console.log('variable connected to DB')
})
app.use('/', variableRouter)
app.listen(5004, () => {
  console.log('variable started')
})
