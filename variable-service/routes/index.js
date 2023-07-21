const Variable = require('../localModels/variable')
const node_xlsx = require('node-xlsx')
const router = require('express').Router()
const fs = require('fs')
const xlsx = require('xlsx')
var jwt = require('jsonwebtoken')
const { checkRole } = require('../../tokenMiddleware')

router.post('/search', async (req, res) => {
  /*
   * #swagger.tags = ['Get All']
   */
  const { filter } = req.body

  console.log(filter)
  const variables = await Variable.find(filter)
  res.send(variables)
})

// const conge = [
//   { du: '01-07-2023', au: '03-07-2023' },
//   { du: '05-07-2023', au: '08-07-2023' },
//   { du: '10-07-2023', au: '17-07-2023' },
// ]
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

// fs.writeFileSync('public/excel' + new Date().valueOf() + '.xlsx', buffer, {
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

router.post(
  '/affect_to_user',
  checkRole(['SUPER_ADMIN', 'COMPTABLE']),
  async (req, res) => {
    /*
     * #swagger.tags = ['Affecter to salarie']
     */
    try {
      const { id_user } = req.body
      console.log(req.body.idUser)
      res.send({ r: req.body })
    } catch (error) {}
  }
)

router.post('/restore', async (req, res) => {
  /*
   * #swagger.tags = ['Restore']
   */
  const { idList } = req.body
  const variables = await Variable.find(idList && { _id: idList })
  variables.map(async (u) => {
    u.deletedAt = null
    result = await u.save()
    return result
  })
  res.send(variables)
})
module.exports = router
