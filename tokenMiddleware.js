var jwt = require('jsonwebtoken')
require('dotenv').config()

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No credentials sent!' })
    }

    var token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        res.send('wrong token')
        return
      } else if (!roles.includes(decoded.role)) {
        res.send('forbidden')
        return
      } else {
        console.log(decoded)
        req.body.idUser = decoded._id
        next()
      }
    })
  }
}

module.exports = { checkRole }
