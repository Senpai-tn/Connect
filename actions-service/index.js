const express = require('express')
const { connect } = require('mongoose')
const app = express()

connect(
  'mongodb+srv://user18:arwxcjkytqQegca6@cluster0.aykhi.mongodb.net/Connect?authMechanism=DEFAULT'
).then(() => {
  console.log('Actions connected To DB')
})
app.get('/', (req, res) => {
  res.send('actions service')
})

app.listen(5007, () => {
  console.log('actions service started ')
})
