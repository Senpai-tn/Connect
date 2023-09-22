const { initializeApp } = require('firebase/app')
const { getAuth } = require('firebase/auth')
const { getFirestore } = require('firebase/firestore')
const { getStorage } = require('firebase/storage')

const firebaseConfig = {
    apiKey: "AIzaSyDGrAVAQsVJV1hMJj9Uzbvwl1tG73au25U",

    authDomain: "ekri-53931.firebaseapp.com",
  
    projectId: "ekri-53931",
  
    storageBucket: "ekri-53931.appspot.com",
  
    messagingSenderId: "1039185785220",
  
    appId: "1:1039185785220:web:32f466997533031cf72dd1"
  
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

module.exports = { auth, db, storage }
