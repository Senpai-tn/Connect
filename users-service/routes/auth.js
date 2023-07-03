const axios = require('axios')
const express = require('express')
const upload = require('../../uploadMiddleware')
const bcrypt = require('bcrypt')
const saltRounds = 10

const User = require('../models/user')

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
              res.send({ ...user._doc })
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
          const hashedPassword = bcrypt.hashSync(password, saltRounds)
          const user = new User({
            uid: response.data.uid,
            email,
            password: hashedPassword,
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

router.get('/:id', async (req, res) => {
  /*
   * #swagger.tags = ['Find by id']
   */
  const user = await User.findById(req.params.id)
  res.send(user)
})

router.put('/:id', upload.single('photo'), async (req, res) => {
  /*
   * #swagger.tags = ['Edit Profile']
   */
  try {
    const {
      email,
      password,
      tel,
      role,
      photo,
      deletedAt,
      blockedAt,
      dateNaissance,
      cp,
      ville,
      adresse,
      civilité,
      listEntreprise,
    } = req.body
    const user = await User.findById(req.params.id)
    if (user) {
      Object.assign(user, {
        email: email ? email : user.email,
        password: password ? password : user.password,
        tel: tel ? tel : user.tel,
        role: role ? role : user.role,
        photo: req.file ? req.file.filename : user.photo,
        deletedAt: deletedAt !== undefined ? deletedAt : user.deletedAt,
        blockedAt: blockedAt ? blockedAt : user.blockedAt,
        dateNaissance: dateNaissance ? dateNaissance : user.dateNaissance,
        cp: cp ? cp : user.cp,
        ville: ville ? ville : user.ville,
        adresse: adresse ? adresse : user.adresse,
        civilité: civilité ? civilité : user.civilité,
        listEntreprise: listEntreprise ? listEntreprise : user.listEntreprise,
      })
      user.save().then((saved) => {
        res.send(saved)
      })
    } else {
      res.status(404).send('user_not_found')
    }
  } catch (error) {}
})

router.post('/search', async (req, res) => {
  /*
   * #swagger.tags = ['Search']
   */
  try {
    const { filter } = req.body
    const users = await User.find(filter)
    res.send(users)
  } catch (error) {
    res.status(500).send({ ...error, message: error.message })
  }
})

router.post('/restore', async (req, res) => {
  const { idList } = req.body
  const users = await User.find(idList && { _id: idList })
  users.map(async (u) => {
    u.deletedAt = null
    result = await u.save()
    return result
  })
  res.send(users)
})
module.exports = router
