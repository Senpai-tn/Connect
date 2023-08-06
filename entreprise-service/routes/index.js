const upload = require('../../uploadMiddleware')
const Entreprise = require('../localModels/entreprise')
const router = require('express').Router()
const axios = require('axios')

router.post('/search', async (req, res) => {
  /*
   * #swagger.tags = ['Search Entreprise']
   */
  try {
    const filter = req.body.filter
    const entreprises = await Entreprise.find(filter)
    const response = await axios.post('http://127.0.0.1:5002/search')
    const users = response.data
    res.send(
      entreprises.map((entreprise) => {
        return {
          ...entreprise._doc,
          gerant: users.find((user) => {
            return user._id == entreprise._doc.gerant
          }),
          comptable: users.find((user) => {
            return user._id == entreprise._doc.comptable
          }),
        }
      })
    )
  } catch (error) {
    res.status(502).send({ ...error })
  }
})

router.post('/', upload.single('logo'), async (req, res) => {
  /*
   * #swagger.tags = ['Add Entreprise']
   */
  try {
    const {
      name,
      gerant,
      comptable,
      siret,
      tel,
      email,
      adress,
      emailComptabilite,
      emailSocial,
      emailJuridique,
      emailGeneral,
    } = req.body
    const entreprise = new Entreprise({
      name,
      gerant,
      comptable,
      siret,
      tel,
      email,
      adress,
      logo: req.file.filename,
      emailComptabilite,
      emailSocial,
      emailJuridique,
      emailGeneral,
    })
    entreprise
      .save()
      .then(async (saved) => {
        axios
          .post(`http://127.0.0.1:5000/api/users/entreprise`, {
            gerant,
            entreprise: saved._id,
          })
          .then((response) => {
            res.send({ entreprise: saved, gerant: response.data })
          })
      })
      .catch((error) => res.status(500).send({ ...error }))
  } catch (error) {
    res.status(500).send({ ...error })
  }
})

router.put('/:id', upload.single('logo'), async (req, res) => {
  /*
   * #swagger.tags = ['Update Entreprise']
   */
  try {
    const { id } = req.params
    const {
      name,
      gerant,
      comptable,
      salaries,
      siret,
      tel,
      email,
      cp,
      ville,
      adresse,
      deletedAt,
      emailComptabilite,
      emailSocial,
      emailJuridique,
      emailGeneral,
    } = req.body
    const entreprise = await Entreprise.findById(id)
    if (entreprise) {
      Object.assign(entreprise, {
        name: name ? name : entreprise.name,
        gerant: gerant ? gerant : entreprise.gerant,
        comptable: comptable ? comptable : entreprise.comptable,
        salaries: salaries ? salaries : entreprise.salaries,
        siret: siret ? siret : entreprise.siret,
        tel: tel ? tel : entreprise.tel,
        email: email ? email : entreprise.email,
        cp: cp ? cp : entreprise.cp,
        ville: ville ? ville : entreprise.ville,
        adresse: adresse ? adresse : entreprise.adresse,
        logo: req.file ? req.file.filename : entreprise.logo,
        deletedAt: deletedAt ? deletedAt : entreprise.deletedAt,
        emailComptabilite: emailComptabilite
          ? emailComptabilite
          : entreprise.emailComptabilite,
        emailSocial: emailSocial ? emailSocial : entreprise.emailSocial,
        emailJuridique: emailJuridique
          ? emailJuridique
          : entreprise.emailJuridique,
        emailGeneral: emailGeneral ? emailGeneral : entreprise.emailGeneral,
      })
      entreprise
        .save()
        .then((saved) => {
          res.send(saved)
        })
        .catch((error) => res.status(500).send({ ...error }))
    } else {
      res.status(404).send({ error: 'entreprise_not_found' })
    }
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.put('/add_employee', async (req, res) => {
  /*
   * #swagger.tags = ['Affecter Salarié']
   */
  try {
    const { id_employee, id_entreprise } = req.body
    const entreprise = await Entreprise.findById(id_entreprise)
    if (entreprise) {
      entreprise.salaries.push(id_employee)
      entreprise
        .save()
        .then((saved) => {
          res.send(saved)
        })
        .catch((error) => {
          res.status(500).send(error)
        })
    } else res.status(404).send('entreprise_not_found')
  } catch (error) {
    res.status(500).send(error)
  }
})

router.put('/remove_employee', async (req, res) => {
  /*
   * #swagger.tags = ['Affecter Salarié']
   */
  try {
    const { id_employee, id_entreprise } = req.body
    const entreprise = await Entreprise.findById(id_entreprise)
    if (entreprise) {
      entreprise.salaries = entreprise.salaries.filter(
        (e) => e._id != id_employee
      )
      entreprise
        .save()
        .then((saved) => {
          res.send(saved)
        })
        .catch((error) => {
          res.status(500).send(error)
        })
    } else res.status(404).send('entreprise_not_found')
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
