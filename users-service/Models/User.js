const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tel: { type: String, required: true },
  adresse: { type: String, required: true },
  role: { type: String, enum: ['Gerant', 'Comptable', 'Admin', 'Super_Admin'] },
  photo: { type: String },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  blockedAt: { type: Date, default: null },
  dateNaissance: { type: Date, required: true },
  cp: { type: String, required: true },
  ville: { type: String, required: true },
  civilité: { type: String, required: true },
})

const User = model('user', userSchema)
User.createIndexes()
module.exports = User
