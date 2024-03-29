const { model, Schema } = require('mongoose')
const userSchema = new Schema({
  uid: { type: String, unique: true, default: null },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, unique: true, default: null },
  password: { type: String, default: null },
  tel: { type: String, default: null },
  role: {
    type: String,
    enum: ['Gerant', 'Comptable', 'Admin', 'Super_Admin', 'Salarie', 'User'],
    default: 'Comptable',
  },
  photo: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  blockedAt: { type: Date, default: null },
  dateNaissance: { type: Date, default: null },
  cp: { type: String, default: null },
  ville: { type: String, default: null },
  adresse: { type: String, default: null },
  pays: { type: String, default: null },
  civilité: { type: String, default: null },
  listContributeurs: { type: [{ type: Schema.Types.ObjectId }], default: [] },
  listEntreprise: { type: [{ type: Schema.Types.ObjectId }], default: [] },
  socketID: String,
  salaire: { type: Number || null, default: null },
  numeroSociale: { type: Number || null, default: null },
  idEntreprise: { type: Schema.Types.ObjectId, default: null },
})
const User = model('users', userSchema)

module.exports = User
