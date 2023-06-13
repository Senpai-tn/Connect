const Entreprise = require('../localModels/entreprise')
const router = require('express').Router()

router.get('/', async (req, res) => {
  const entreprises = await Entreprise.find()
  res.send(entreprises)
})

router.post('/', async (req, res) => {
  try {
    const entreprise = new Entreprise({ createdAt: new Date() })
    entreprise.save().then((s) => {
      res.send(s)
    })
  } catch (error) {
    res.status(500).send({ ...error })
  }
})
module.exports = router
