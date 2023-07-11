const NoteFrais = require('../models/notefrais')

const router = require('express').Router()

router.post('/search', async (req, res) => {
  const { filter } = req.body
  const notes = await NoteFrais.find(filter)
  res.send(notes)
})

router.post('/', async (req, res) => {
  const {
    date,
    description,
    motif,
    modeReglement,
    justificatif,
    justificatifURL,
    montantHT,
    montantTVA,
    commentaire,
    salarie,
  } = req.body

  const note = new NoteFrais({
    date,
    description,
    motif,
    modeReglement,
    justificatif,
    justificatifURL,
    montantHT,
    montantTVA,
    commentaire,
    salarie,
    createdAt,
    deletedAt,
  })
  note
    .save()
    .then((saved) => {
      res.send(saved)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const {
    date,
    description,
    motif,
    modeReglement,
    justificatif,
    justificatifURL,
    montantHT,
    montantTVA,
    commentaire,
    salarie,
    createdAt,
    deletedAt,
  } = req.body
  try {
    const note = await NoteFrais.findById(id)
    Object.assign(note, {
      date,
      description,
      motif,
      modeReglement,
      justificatif,
      justificatifURL,
      montantHT,
      montantTVA,
      commentaire,
      salarie,
      createdAt,
      deletedAt,
    })
    note
      .save()
      .then((saved) => {
        res.send(saved)
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
