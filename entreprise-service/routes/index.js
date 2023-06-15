const proxy = require('express-http-proxy')
const upload = require('../../uploadMiddleware')
const Entreprise = require('../localModels/entreprise')
const router = require('express').Router()
const axios = require('axios')
router.get('/', async (req, res) => {
  const entreprises = await Entreprise.find()
  res.send(entreprises)
})

router.post('/', upload.single('images'), async (req, res) => {
  const { name, gerant, comptable, siret, tel, email, adress } = req.body
  try {
    const entreprise = new Entreprise({
      name,
      gerant,
      comptable,
      siret,
      tel,
      email,
      adress,
      logo: req.file.filename,
    })
    entreprise
      .save()
      .then(async (saved) => {
        axios
          .get(`http://127.0.0.1:5000/api/users/${gerant}`)
          .then((response) => {
            res.send(response.data)
          })
      })
      .catch((error) => res.status(500).send({ ...error }))
  } catch (error) {
    res.status(500).send({ ...error })
  }
})
module.exports = router
