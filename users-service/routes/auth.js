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
      .post('http://localhost:5000/api/auth/login', { email, password })
      .then(async (response) => {
        if (response.data.customData) {
          if (
            response.data.customData.message !==
            'FirebaseError: Firebase: Error (auth/wrong-password).'
          ) {
            if (
              response.data.customData.message ===
              'FirebaseError: Firebase: Error (auth/user-not-found).'
            ) {
              res.status(404).send('not found')
            }
          } else res.status(403).send('password error')
        } else {
          const user = await User.findOne({ uid: response.data.user.uid })
          if (!user.deletedAt) {
            if (!user.blockedAt) {
              res.send({ ...user._doc, password: undefined })
            } else res.status(401).send('user blocked')
          } else res.status(402).send('user deleted')
        }
      })
      .catch((error) => {
        res.send({ ...error })
      })
  } catch (error) {
    res.status(500).send({ ...error })
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
        if (response.data.customData) {
          if (
            response.data.customData.message ===
            'FirebaseError: Firebase: Error (auth/email-already-in-use).'
          ) {
            res.status(402).send('email already used')
          }
        } else {
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
              res.send({ message: error.message })
            })
        }
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
