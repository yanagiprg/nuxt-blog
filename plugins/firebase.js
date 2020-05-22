import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyCANGwwIBzIEZuT_DGufxQd8CmCeQVO-Qs',
  authDomain: 'nuxt-b-9156c.firebaseapp.com',
  databaseURL: 'https://nuxt-b-9156c.firebaseio.com',
  projectId: 'nuxt-b-9156c',
  storageBucket: 'nuxt-b-9156c.appspot.com',
  messagingSenderId: '1082878613716',
  appId: '1:1082878613716:web:8e41f53286719113570341',
  measurementId: 'G-Z5LYLBM3HP'
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
