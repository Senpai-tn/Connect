const { model, Schema } = require('mongoose')
const entrepriseSchema = new Schema({
  name: { type: String, required: true },
  gerant: { type: Schema.Types.ObjectId },
  comptable: { type: Schema.Types.ObjectId },
  salaries: { type: [{ type: Schema.Types.ObjectId }], default: [] },
  siret: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true },
  adress: { type: { adress: { type: String, required: true } } },
  logo: { type: String },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
})

const Entreprise = model('entreprises', entrepriseSchema)

module.exports = Entreprise
