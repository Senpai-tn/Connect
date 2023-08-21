const express = require('express')
const cors = require('cors')
const app = express()
const default_proxy = require('express-http-proxy')
require('dotenv').config()
const path = require('path')
const https = require('https')
const fs = require('fs')
const server = https.createServer(
  {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem'),
  },
  app
)
app.use(express.json())

app.options('*', cors())

app.use(cors())

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
app.use('/api/actions', proxy('http://localhost:5007'))

app.get('/', (req, res) => {
  res.send(
    `main route : <br/>
    /api/users<br/>
    /api/entreprises <br/>
    /api/variables<br/> 
    /api/note_frais<br/>
    /api/actions<br/>`
  )
})

app.listen(5000, () => {
  console.log('Secure server is listening on port 5000')
})
