const express = require('express')
const cors = require('cors')
const app = express()
const default_proxy = require('express-http-proxy')
require('dotenv').config()
const path = require('path')
const http = require('http')
const server = http.createServer(app)
app.use(express.json())

app.use(cors())

const { Server } = require('socket.io')

const { verifToken } = require('./tokenMiddleware')

const isMultipartRequest = function (req) {
  const contentTypeHeader = req.headers['content-type']
  return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1
}

const proxy = function (host) {
  return function (req, res, next) {
    if (isMultipartRequest(req)) {
      return default_proxy(host, {
        reqAsBuffer: true,
        reqBodyEncoding: null,
        parseReqBody: false,
      })(req, res, next)
    } else return default_proxy(host)(req, res, next)
  }
}
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/auth', proxy('http://localhost:5001'))
app.use('/api/users', proxy('http://localhost:5002'))
app.use('/api/entreprises', proxy('http://localhost:5003'))
app.use('/api/variables', proxy('http://localhost:5004'))
app.use('/api/note_frais', proxy('http://localhost:5005'))

const io = new Server(server)

app.get('/', (req, res) => {
  res.send('main route')
})

app.get('/close', (req, res) => {
  server.close()
  res.send('sdfldqfjdskqf')
})

server.listen(5000, () => {
  console.log('Secure server is listening on port 5000')
})

module.exports = io
