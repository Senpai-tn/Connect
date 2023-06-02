const { default: axios } = require('axios')
const express = require('express')
const User = require('../Models/User')

const router = express.Router()

router.post('/login', (req, res) => {
  /*
   * #swagger.tags = ['Login']
   */
  try {
    const { email, password } = req.body
    axios
      .post('http://165.51.222.52:5000/api/auth/login', { email, password })
      .then((response) => {
        res.send(response.data)
      })
      .catch((error) => {
        res.send(error)
      })
  } catch (error) {
    res.status(500).send({ error })
  }
})

router.post('/register', (req, res) => {
  /*
   * #swagger.tags = ['Register']
   */

  try {
    const {
      email,
      password,
      tel,
      adresse,
      role,
      photo,
      dateNaissance,
      cp,
      ville,
      civilité,
    } = req.body
    axios
      .post('http://localhost:5000/api/auth/register', { email, password })
      .then(async (response) => {
        const user = new User({
          uid: response.data.uid,
          email,
          password,
          tel,
          adresse,
          role,
          photo,
          dateNaissance,
          cp,
          ville,
          civilité,
        })
        user
          .save()
          .then((response) => {
            res.send(response)
          })
          .catch((error) => {
            res.send({ ...error })
          })
      })
      .catch((error) => {
        res.send({ ...error })
      })
  } catch (error) {
    res.status(500).send({ ...error })
  }
})

router.get('/search', async (req, res) => {
  /*
   * #swagger.tags = ['Search']
   */
  try {
    const { filter } = req.query
    const users = await User.find(filter)
    res.send(users)
  } catch (error) {
    res.status(500).send({ ...error })
  }
})

module.exports = router
