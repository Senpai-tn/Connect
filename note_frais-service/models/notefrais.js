const { Schema, model } = require('mongoose')
const noteFraisSchema = new Schema({
  date: { type: Date, default: Date.now },
  description: { type: String },
  motif: { type: String },
  modeReglement: { type: String },
  justificatif: { type: String },
  justificatifURL: { type: String },
  montantHT: { type: String },
  montantTVA: { type: String },
  commentaire: { type: String },
  salarie: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
})
const NoteFrais = model('notes_frais', noteFraisSchema)
module.exports = NoteFrais
