const { initializeApp } = require('firebase/app')
const { getAuth } = require('firebase/auth')
const { getFirestore } = require('firebase/firestore')
const { getStorage } = require('firebase/storage')

const firebaseConfig = {
  apiKey: 'AIzaSyCNPA21TL-EUhkbRM3UXHg7izXRpp46IlM',
  authDomain: 'connect-ef1c5.firebaseapp.com',
  projectId: 'connect-ef1c5',
  storageBucket: 'connect-ef1c5.appspot.com',
  messagingSenderId: '564194901088',
  appId: '1:564194901088:web:8e0df71baa23f0f4769705',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

module.exports = { auth, db, storage }
