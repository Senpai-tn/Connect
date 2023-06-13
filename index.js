const express = require('express')
const app = express()
const proxy = require('express-http-proxy')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use('/api/auth', proxy('http://localhost:5001'))
app.use('/api/users', proxy('http://localhost:5002'))
app.use('/api/entreprises', proxy('http://localhost:5003'))
app.use('/api/variables', proxy('http://localhost:5004'))

app.listen(5000, () => {
  console.log('app started')
})
