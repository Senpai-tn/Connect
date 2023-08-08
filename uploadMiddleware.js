const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    req.query.path
      ? cb(null, `public/${req.query.path}`)
      : file.mimetype === 'application/pdf'
      ? cb(null, 'public/pdf')
      : file.mimetype.includes('image/')
      ? cb(null, 'public/images')
      : cb(null, 'public/excel')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage })

module.exports = upload
