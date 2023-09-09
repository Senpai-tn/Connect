const axios = require('axios')
const express = require('express')
const upload = require('../../uploadMiddleware')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const node_xlsx = require('node-xlsx')
const saltRounds = 10

const User = require('../models/user')

const router = express.Router()

router.post('/login', (req, res) => {
  /*
   * #swagger.tags = ["Login"]
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
              var token = jwt.sign({ user: user._doc }, process.env.JWT_KEY, {})
              res.send({ user: user._doc, token })
            } else res.status(401).send('user blocked')
          } else res.status(402).send('user deleted')
        }
      })
      .catch((error) => {
        res.send({ message: error.message })
      })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

router.post('/register', upload.single('photo'), (req, res) => {
  /*
   * #swagger.tags = ["Register"]
   */

  try {
    const {
      email,
      password,
      tel,
      firstName,
      lastName,
      adresse,
      role,
      photo,
      dateNaissance,
      cp,
      ville,
      civilité,
      listContributeurs,
      pays,
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
            photo: req.file ? req.file.filename : null,
            dateNaissance,
            cp,
            ville,
            civilité,
            listContributeurs,
            pays,
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

router.get('/', async (req, res) => {
  /*
   * #swagger.tags = ["Find by id"]
   */
  const user = await User.findById(req.query.id)
  res.send(user)
})

router.put('/:id', upload.single('photo'), async (req, res) => {
  /*
   * #swagger.tags = ["Edit Profile"]
   */
  try {
    const {
      email,
      password,
      tel,
      role,
      firstName,
      lastName,
      deletedAt,
      blockedAt,
      dateNaissance,
      cp,
      ville,
      adresse,
      civility,
      listEntreprise,
      socketID,
      pays,
      listContributeurs,
      salaire,
      idEntreprise,
    } = req.body

    const user = await User.findById(req.params.id)
    if (user) {
      Object.assign(user, {
        firstName: firstName ? firstName : user.firstName,
        lastName: lastName ? lastName : user.lastName,
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
        pays: pays ? pays : user.pays,
        socketID: socketID ? socketID : user.socketID,
        adresse: adresse ? adresse : user.adresse,
        civilité: civility ? civility : user.civilité,
        salaire: salaire ? salaire : user.salaire,
        idEntreprise: idEntreprise ? idEntreprise : user.idEntreprise,
        listEntreprise: listEntreprise ? listEntreprise : user.listEntreprise,
        listContributeurs: listContributeurs
          ? listContributeurs
          : user.listContributeurs,
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
   * #swagger.tags = ["Search"]
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
  /*
   * #swagger.tags = ["Restore"]
   */
  const { idList } = req.body
  const users = await User.find(idList && { _id: idList })
  users.map(async (u) => {
    u.deletedAt = null
    u.blockedAt = null
    result = await u.save()
    return result
  })
  res.send(users)
})

router.post('/add_user', upload.single('photo'), async (req, res) => {
  /*
   * #swagger.tags = ["Add user"]
   */
  {
    const { firstName, lastName, dateNaissance, civilité, email, role, pays } =
      req.body
    axios
      .post('http://localhost:5000/api/auth/register', {
        email,
        password: 'password',
      })
      .then(async (response) => {
        if (response.data.customData) {
          if (
            response.data.customData.message ===
            'FirebaseError: Firebase: Error (auth/email-already-in-use).'
          ) {
            res.status(402).send('email already used')
          }
        } else {
          const hashedPassword = bcrypt.hashSync('password', saltRounds)
          const user = new User({
            uid: response.data.uid,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            dateNaissance,
            civilité,
            photo: req.file ? req.file.filename : null,
            role,
            pays,
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
  }
})

router.post(
  '/import_excel',
  upload.single('list_salarie'),
  async (req, res) => {
    /*
     * #swagger.tags = ["Import from Excel file"]
     */

    try {
      const { role } = req.body
      const { path = 'imports_salaries' } = req.query
      const workSheetsFromFile = req.file
        ? node_xlsx.parse(`public/${path}/${req.file.filename}`, {
            type: 'binary',
            cellDates: true,
            cellNF: false,
            cellText: false,
          })
        : []

      const succeed = []
      const failed = []
      {
        await Promise.all(
          workSheetsFromFile.map(async (feuille) => {
            await Promise.all(
              feuille.data.map(async (row) => {
                await axios
                  .post(`${process.env.baseURL}/auth/register`, {
                    email: row[2],
                    password: row[5],
                  })
                  .then(async (response) => {
                    const u = new User({
                      uid: response.data.uid,
                      firstName: row[0],
                      lastName: row[1],
                      email: row[2],
                      dateNaissance: new Date(row[3]),
                      tel: row[4],
                      role: role,
                    })
                    await u
                      .save()
                      .then((savedUser) => {
                        succeed.push(savedUser)
                      })
                      .catch(async (error) => {
                        failed.push(u)
                      })
                  })
              })
            )
          })
        )
      }

      res.send({ succeed, failed })
    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  }
)

module.exports = router
