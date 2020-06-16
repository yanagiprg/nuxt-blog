/* eslint-disable no-empty-pattern */
import firebase from '~/plugins/firebase'

export const state = () => ({
  userUid: '',
  userName: ''
})

export const mutations = {
  setUserUid(state, userUid) {
    state.userUid = userUid
  },
  setUserName(state, userName) {
    state.userName = userName
  }
}

export const actions = {
  async createUser({}, { email, password }) {
    console.log(email, password)
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

export const getters = {
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  }
}
