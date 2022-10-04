import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'
import { isBrowser } from './isBrowser'

// prevent firebse from reinitializing during hot reload
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  })
}

export type DocRef = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

export const firestore = firebase.firestore()
if (isBrowser() && window.location.hostname === 'localhost') {
  firestore.useEmulator('localhost', 8080)
}

export const auth = firebase.auth()
if (isBrowser() && window.location.hostname === 'localhost') {
  auth.useEmulator('http://localhost:9099')
}
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const database = firebase.database()
if (isBrowser() && window.location.hostname === 'localhost') {
  database.useEmulator('localhost', 9000)
}
export default firebase
