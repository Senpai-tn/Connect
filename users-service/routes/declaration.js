const axios = require('axios')
const Entreprise = require('../../entreprise-service/localModels/entreprise')
const User = require('../models/user')
const Action = require('../../actions-service/models/action')
const declaration_entree = require('../../mail-content/declaration-entree')
const declaration_sortie = require('../../mail-content/declaration-sortie')
const router = require('express').Router()

const config = {
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'api-key':
      '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',
  },
}

router.post('/entree', async (req, res) => {
  try {
    const { idEntreprise, salarie } = req.body
    if (entreprise.salaries.includes(idSalarie))
      if (salarie) {
        await axios
          .post(`${process.env.baseURL}/auth/register`, {
            email: salarie.email,
            password: salarie.password,
          })
          .then((response) => {
            const user = new User({
              ...salarie,
              uid: response.data.uid,
              role: 'Salarie',
            })

            user
              .save()
              .then(async (savedUser) => {
                const entreprise = await Entreprise.findById(idEntreprise)
                console.log(declaration_entree(savedUser))
                salarie && entreprise.salaries.push(savedUser)
                entreprise.save().then((savedEntreprise) => {
                  savedEntreprise.emailComptabilite
                    ? axios
                        .post(
                          'https://api.brevo.com/v3/smtp/email',
                          {
                            sender: {
                              name: 'Khaled Sahli',
                              email: 'khaledsahli36@gmail.com',
                            },
                            to: [
                              {
                                email: savedEntreprise.emailComptabilite,
                                name: 'Service Comptabilité',
                              },
                            ],
                            subject: `Declaration d'entrée`,
                            htmlContent: declaration_entree(savedUser),
                          },
                          config
                        )
                        .then((response) => {
                          res.send(savedEntreprise)
                        })
                    : res.send(
                        'salarié ajouté avec succés mais aucun mail configuré pour service comptabilité'
                      )
                })
              })
              .catch((error) => {
                console.log(Object.keys(error.keyPattern))
                res.send({
                  error: error.code,
                  field: Object.keys(error.keyPattern),
                })
              })
          })
      } else res.status(404).send(`you must send employee informations`)
  } catch (error) {
    res.send({ error: error.message })
  }
})

router.post('/sortie', async (req, res) => {
  try {
    const { idEntreprise, idSalarie } = req.body
    const entreprise = await Entreprise.findById(idEntreprise)
    const user = await User.findById(idSalarie)
    if (user === null) {
      res.send('user null')
    } else {
      if (entreprise.salaries.includes(idSalarie)) {
        entreprise.salaries = entreprise.salaries.filter(
          (id) => id != idSalarie
        )
        entreprise.save().then((savedEntreprise) => {
          savedEntreprise.emailComptabilite
            ? axios
                .post(
                  'https://api.brevo.com/v3/smtp/email',
                  {
                    sender: {
                      name: 'Khaled Sahli',
                      email: 'khaledsahli36@gmail.com',
                    },
                    to: [
                      {
                        email: savedEntreprise.emailComptabilite,
                        name: 'Service Comptabilité',
                      },
                    ],
                    subject: `Declaration de sortie`,
                    htmlContent: declaration_sortie(user),
                  },
                  config
                )
                .then((response) => {
                  res.send(savedEntreprise)
                })
            : res.send(
                'declaration de sortie a été effectué avec succés mais aucun mail configuré pour service comptabilité'
              )
        })
      } else {
        res.send(`user n'est pas déclarer dans cette entreprise`)
      }
    }
  } catch (error) {}
})

router.post('/arret', async (req, res) => {
  const { idEntreprise, salarie, idUser } = req.body
  const entreprise = await Entreprise.findById(idEntreprise)
  const user = await User.findById(salarie._id)
  const action = new Action({ type: 'arret', object: user, user: idUser })
  action.save().then((savedAction) => {
    res.send(savedAction)
  })
})
router.post('/accident', async (req, res) => {})

module.exports = router
