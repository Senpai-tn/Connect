const Variable = require('../localModels/variable')

const router = require('express').Router()

router.get('/', async (req, res) => {
  /*
   * #swagger.tags = ['Get All']
   */
  const variables = await Variable.find()
  res.send(variables)
})

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
