import firebase from 'firebase'

const app = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'warcraft3-de206.firebaseapp.com',
  databaseURL: 'https://warcraft3-de206.firebaseio.com',
  projectId: 'warcraft3-de206',
  storageBucket: 'warcraft3-de206.appspot.com',
  messagingSenderId: '629909774383',
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
})

export const firestoreAPI = {}
