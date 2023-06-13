const { model, Schema } = require('mongoose')
const entrepriseSchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
})

const Entreprise = model('entreprises', entrepriseSchema)

module.exports = Entreprise
