const axios = require('axios')
const express = require('express')
const User = require('../models/user')
const router = express.Router()

router.post('/', async (req, res) => {
  /*
   * #swagger.tags = ['Add Entreprise']
   */
  try {
    const { entreprise, gerant } = req.body
    const user = await User.findById(gerant)
    user.listEntreprise.push(entreprise)
    user
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

router.delete('/', async (req, res) => {
  /*
   * #swagger.tags = ['Remove Entreprise']
   */
  try {
    const { entreprise, gerant } = req.body
    const user = await User.findById(gerant)
    if (user) {
      user.listEntreprise = user.listEntreprise.filter((e) => {
        return e._id != entreprise
      })
      user
        .save()
        .then((saved) => {
          res.send(saved)
        })
        .catch((error) => {
          res.status(500).send({ ...error })
        })
    } else res.status(404).send('user_not_found')
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

module.exports = router
