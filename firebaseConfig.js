import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const firebaseConfig = {
    apiKey: "AIzaSyCt1XPDMVBVWBiofg1wQ663_C3E78SN1w4",
    authDomain: "roomq-793f9.firebaseapp.com",
    databaseURL: "https://roomq-793f9.firebaseio.com",
    projectId: "roomq-793f9",
    storageBucket: "roomq-793f9.appspot.com",
    messagingSenderId: "24824241474",
    appId: "1:24824241474:web:a9dab94ed9fdaebe79bcdb",
    measurementId: "G-XVTZJ533H0"
  };
firebase.initializeApp(firebaseConfig)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
}
db.settings(settings)

// firebase collections
const queuesCollection = db.collection('queues')

export {
    db,
    auth,
    currentUser,
    queuesCollection
}