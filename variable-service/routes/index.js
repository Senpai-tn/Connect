const Variable = require('../localModels/variable')
const node_xlsx = require('node-xlsx')
const router = require('express').Router()
const fs = require('fs')
const xlsx = require('xlsx')
router.get('/', async (req, res) => {
  /*
   * #swagger.tags = ['Get All']
   */
  const variables = await Variable.find()
  res.send(variables)
})

const conge = [
  { du: '01-07-2023', au: '03-07-2023' },
  { du: '05-07-2023', au: '08-07-2023' },
  { du: '10-07-2023', au: '17-07-2023' },
]
// const workSheetsFromFile = node_xlsx.parse(`public/VARIABLES_DE_PAIE.xlsx`)
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
// var buffer = node_xlsx.build([
//   { name: 'mySheetName', data: workSheetsFromFile[0].data },
// ]) // Returns a buffer

// fs.writeFileSync('public/' + new Date().valueOf() + '.xlsx', buffer, {
//   flag: 'wx',
// })

router.post('/', async (req, res) => {
  /*
   * #swagger.tags = ['Add']
   */
  try {
    const { name, type, value } = req.body
    const variable = new Variable({ name, type, value })
    variable
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

router.put('/', async (req, res) => {
  /*
   * #swagger.tags = ['Update / Delete']
   */
  try {
    const { id, name, type, deletedAt } = req.body
    const variable = await Variable.findById(id)
    if (variable) {
      Object.assign(variable, {
        name: name ? name : variable.name,
        type: type ? type : variable.type,
        deletedAt: deletedAt ? deletedAt : variable.deletedAt,
      })
      res.send(variable)
    } else res.status(404).send({ message: 'not found' })
  } catch (error) {}
})
module.exports = router
