const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    file.mimetype !== 'application/pdf'
      ? cb(null, 'public/images')
      : cb(null, 'public/pdf')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage })

module.exports = upload
