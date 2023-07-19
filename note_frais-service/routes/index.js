const NoteFrais = require('../models/notefrais')
const node_xlsx = require('node-xlsx')
const router = require('express').Router()
const fs = require('fs')

const conge = [
  { du: '01-07-2023', au: '03-07-2023' },
  { du: '05-07-2023', au: '08-07-2023' },
  { du: '10-07-2023', au: '17-07-2023' },
]
const workSheetsFromFile = node_xlsx.parse(
  `public/excel/modele-note-de-frais.xlsx`
)
// workSheetsFromFile[0].data[0][2] = 'Connect'
// workSheetsFromFile[0].data[1][7] = 'Juillet'
// workSheetsFromFile[0].data[3][2] = 'Khaled Sahli'
// workSheetsFromFile[0].data[12] = ['CONGES', 'Congés payés'].concat(
//   conge.map((c) => 'Du : ' + c.du)
// )
// workSheetsFromFile[0].data[13] = [null, ''].concat(
//   conge.map((c) => 'Au : ' + c.au)
// )
// workSheetsFromFile[0].data[4] = [
//   null,
//   'Montant du salaire (préciser si brut ou net)',
//   '1500',
//   'Net',
// ]
const notes = [
  { id: null, date: '11/07/2023' },
  { id: null, date: '11/07/2023' },
  { id: null, date: '11/07/2023' },
  { id: null, date: '11/07/2023' },
  { id: null, date: '11/07/2023' },
  { id: null, date: '11/07/2023' },
  { id: null, date: '11/07/2023' },
]
const main = workSheetsFromFile[0].data.slice(0, -6)
const footer = workSheetsFromFile[0].data.slice(-6)

notes.map((nf, index) => {
  main[11 + index] = Object.values(nf)
})
var buffer = node_xlsx.build([
  { name: 'mySheetName', data: [...main, ...footer] },
]) // Returns a buffer

// fs.writeFileSync('public/excel/' + new Date().valueOf() + '.xlsx', buffer, {
//   flag: 'wx',
// })

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
