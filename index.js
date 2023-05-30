const express = require('express')
const app = express()
const proxy = require('express-http-proxy')
const cors = require('cors')
const mongoose = require('mongoose')
app.use(cors())
app.use(express.json())

mongoose
  .connect(
    'mongodb+srv://user18:arwxcjkytqQegca6@cluster0.aykhi.mongodb.net/Connect?authMechanism=DEFAULT'
  )
  .then(() => {
    console.log('App Connected to DB')
  })
app.use('/users', proxy('http://localhost:5002'))
app.use('/api/auth', proxy('http://localhost:5001'))
app.use('/api/users', proxy('http://localhost:5002'))

app.listen(5000, () => {
  console.log('app started')
})
