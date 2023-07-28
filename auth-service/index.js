const express = require('express')
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require('firebase/auth')
const https = require('https')
const fs = require('fs')
const app = express()
const server = https.createServer(
  {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
  },
  app
)
const { auth } = require('../firebase')

app.use(express.json())
app.get('/', (req, res) => {
  res.send('auth service')
})

app.post('/login', (req, res) => {
  try {
    const { email, password } = req.body
    signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        res.status(200).send(value)
      })
      .catch((error) => {
        res.send(error)
      })
  } catch (error) {
    res.status(500).send({ ...error })
  }
})

app.post('/register', (req, res) => {
  try {
    const { email, password } = req.body
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        res.send(response.user)
      })
      .catch((error) => {
        res.send({ ...error })
      })
  } catch (error) {
    res.status(500).send({ error: 'error' })
  }
})
app.listen(5001, () => {
  console.log('auth service started')
})
