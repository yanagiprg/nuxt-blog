/* eslint-disable no-empty-pattern */
import _ from 'lodash'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()

export const state = () => ({
  users: [],
  user: {},
  isLogin: false
})

export const getters = {
  users(state) {
    return state.users
  },
  user(state) {
    return state.user
  },
  isLogin(state) {
    return state.isLogin
  }
}

export const mutations = {
  setUsers(state, users) {
    state.users = users
  },
  setUser(state, user) {
    state.user = user
  },
  setIsLogin(state, isLogin) {
    state.isLogin = isLogin
  }
}

export const actions = {
  async createUser({ state, commit }, form) {
    const user = state.user
    await db
      .collection('users')
      .doc(user.uid)
      .set({
        id: user.uid,
        name: form.name,
        email: form.email,
        password: form.password
      })
    commit('setUsers', form)
  },

  async signup({ commit }, { email, password }) {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        const user = res.user
        commit('setUser', _.cloneDeep(user))
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

  logout({ commit }) {
    firebase.auth().signOut()
    commit('setUser', null)
    console.log('succeed in logout')
  },

  async getUsers({ state, commit }) {
    const user = state.user
    const users = []
    let snapShot = await db
      .collection('users')
      .doc(user.uid)
      .get()
    const userData = await snapShot.data()
    if (userData.admin_id) {
      snapShot = await db.collection('users').get()
      snapShot.forEach((doc) => {
        users.push(doc.data())
      })
    } else {
      users.push(userData)
    }
    commit('setUsers', users)
  },

  async deleteUser({ dispatch }, id) {
    await db
      .collection('users')
      .doc(id)
      .delete()
    dispatch('getUsers')
  },

  async editUser({}, id) {
    const snapShot = await db
      .collection('users')
      .doc(id)
      .get()
    const userIndex = this.state.users.findIndex(
      (user) => user.id === snapShot.id
    )
    this.state.users[userIndex] = snapShot.data()
  },

  async showUser({}, id) {
    const snapShot = await db
      .collection('users')
      .doc(id)
      .get()
    const userData = await snapShot.data()
    return userData
  },

  async updateUser({ dispatch }, { id, form }) {
    const userRef = await db.collection('users').doc(id)
    await userRef.update({
      name: form.name,
      email: form.email,
      password: form.password
    })
    dispatch('getUsers', form)
  },

  async getAdmin({ state }) {
    const user = state.user
    const snapShot = await db.collection('users').doc(user.uid)
    const userData = await snapShot.data()
    return userData.admin_id ? 'exist' : ''
  }
}
