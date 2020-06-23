/* eslint-disable no-empty-pattern */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const usersRef = db.collection('users')

export const state = () => ({
  userUid: '',
  userName: '',
  users: []
})

export const getters = {
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  },
  users(state) {
    return state.users
  }
}

export const actions = {
  getUsers({ commit }) {
    usersRef.get().then((snapShot) => {
      const users = []
      snapShot.forEach((doc) => {
        users.push(doc.data())
      })
      commit('getUsers', users)
    })
  },

  createUser({ dispatch }, user) {
    usersRef
      .add({})
      .then((res) => {
        console.log(user.name)
        usersRef.doc(res.id).set({
          id: res.id,
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

export const mutations = {
  setUserUid(state, userUid) {
    state.userUid = userUid
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  getUsers(state, users) {
    state.users = users
  }
}
