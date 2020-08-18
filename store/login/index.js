/* eslint-disable no-empty-pattern */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()

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
  },
  user(state) {
    return state.user
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
  },
  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  async createUser({ dispatch, state }, form) {
    const user = state.user
    await db
      .collection('users')
      .doc(user.uid)
      .set({
        id: user.uid,
        name: form.name,
        email: form.email
      })
    dispatch('getUsers', form)
  },

  async signup({}, { email, password }) {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        const user = res.user
        console.log(user)
      })
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
      .then((res) => {
        const user = res.user
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
