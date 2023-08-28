const { Schema, model } = require('mongoose')
const variableSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: Schema.Types.Mixed },
  idSalarie: { type: Schema.Types.ObjectId },
  idEntreprise: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  nbJour: { type: Number || null },
})
const Variable = model('variables', variableSchema)
module.exports = Variable
