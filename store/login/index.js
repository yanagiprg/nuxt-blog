/* eslint-disable no-empty-pattern */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const usersRef = db.collection('users')

export const state = () => ({
  userUid: '',
  userName: '',
  users: [],
  user: null
})

export const getters = {
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  },
  getUsers(state) {
    return state.users
  }
}

export const mutations = {
  setUserUid(state, userUid) {
    state.userUid = userUid
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  setUsers(state, users) {
    state.users = users
  }
}

export const actions = {
  createUser({ dispatch }, user) {
    usersRef
      .add({})
      .then((result) => {
        const user = result.user
        console.log(user.name)
        usersRef.doc(user.uid).set({
          id: user.uid,
          name: user.name,
          email: user.email
        })
      })
      .then(() => {
        dispatch('getUsers', user)
      })
  },

  async signup({}, { email, password }) {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
  },

  loginWithPassword({}, { email, password }) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
  },

  loginWithGoogle({ commit }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        const user = result.user
        console.log('success : ' + user.uid + ' : ' + user.displayName)
        commit('setUserUid', user.uid)
        commit('setUserName', user.displayName)
      })
      .catch(function(error) {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
  },

  logout() {
    firebase.auth().signOut()
    console.log('succeed in logout')
  }
}
