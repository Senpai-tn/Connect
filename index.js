const express = require('express')

const app = express()
const default_proxy = require('express-http-proxy')
const cors = require('cors')

const path = require('path')

app.use(cors())
app.use(express.json())

const { Server } = require('socket.io')

const http = require('http')

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

const server = http.createServer(app)

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
