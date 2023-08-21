const { Schema, model } = require('mongoose')
const actionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId },
  type: { type: String },
  object: { type: Object },
})

const Action = model('actions', actionSchema)

module.exports = Action
