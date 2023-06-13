const { Schema, model } = require('mongoose')
const variableSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
})

const Variable = model('variables', variableSchema)
module.exports = Variable
