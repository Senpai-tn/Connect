const express = require('express')
const http2 = require('http2')
const app = express()
const default_proxy = require('express-http-proxy')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const upload = require('./uploadMiddleware')
app.use(cors())
app.use(express.json())

const isMultipartRequest = function (req) {
  const contentTypeHeader = req.headers['content-type']
  return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1
}

const proxy = function (host) {
  return function (req, res, next) {
    let reqBodyEncoding
    let reqAsBuffer = false
    let parseReqBody = true

    if (isMultipartRequest(req)) {
      reqAsBuffer = true
      reqBodyEncoding = null
      parseReqBody = false
    }
    return default_proxy(host, {
      reqAsBuffer,
      reqBodyEncoding,
      parseReqBody,
    })(req, res, next)
  }
}

app.use('/api/auth', proxy('http://localhost:5001'))
app.use('/api/users', proxy('http://localhost:5002'))
app.use('/api/entreprises', proxy('http://localhost:5003'))
app.use('/api/variables', proxy('http://localhost:5004'))

app.listen(5000, () => {
  console.log('Secure server is listening on port 5000')
})
