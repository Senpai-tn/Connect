const { model, Schema } = require('mongoose')
const entrepriseSchema = new Schema({
  name: { type: String, required: true },
  gerant: { type: Schema.Types.ObjectId },
  comptable: { type: Schema.Types.ObjectId },
  salaries: { type: [{ type: Schema.Types.ObjectId }], default: [] },
  siret: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true },
  cp: { type: String, default: null },
  ville: { type: String, default: null },
  adresse: { type: String, default: null },
  logo: { type: String },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  emailComptabilite: { type: String, default: '' },
  emailSocial: { type: String, default: '' },
  emailJuridique: { type: String, default: '' },
  emailGeneral: { type: String, default: '' },
})

const Entreprise = model('entreprises', entrepriseSchema)

module.exports = Entreprise
