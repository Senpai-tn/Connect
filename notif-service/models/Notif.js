const { Schema, model } = require('mongoose')
const notifSchema = new Schema({
  reciever: { type: Schema.Types.ObjectId, ref: 'users' },
  sender: { type: Schema.Types.ObjectId, ref: 'users' },
  content: { type: String },
  type: { type: String },
  createdAt: { type: Date, default: Date.now },
  state: { type: String },
})
const Notif = model('notifs', notifSchema)
module.exports = Notif
