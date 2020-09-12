/* eslint-disable no-empty-pattern */
import _ from 'lodash'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()

export const state = () => ({
  users: [],
  user: {},
  isLogin: false,
  adminUser: {}
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
  },

  adminUser(state) {
    return state.adminUser
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
  },

  setAdminUser(state, adminUser) {
    state.adminUser = adminUser
  }
}

export const actions = {
  async createUser({ state, commit }, payload) {
    const user = _.cloneDeep(state.user)
    await db
      .collection('users')
      .doc(user.uid)
      .set({
        id: user.uid,
        name: payload.name,
        email: payload.email
      })
    await user.updateProfile({
      displayName: payload.name
    })
    commit('setUsers', _.cloneDeep(payload))
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
    await commit('setUsers', users)
  },

  async getAdminUser({ state, commit }) {
    const user = state.user
    const snapShot = await db
      .collection('users')
      .doc(user.uid)
      .get()
    const adminUser = await snapShot.data()
    commit('setAdminUser', _.cloneDeep(adminUser))
  },

  async deleteUser({ dispatch, state }, id) {
    const user = _.cloneDeep(state.user)
    await db
      .collection('users')
      .doc(id)
      .delete()
    const articleRef = await db
      .collection('articles')
      .where('user_id', '==', id)
      .get()
    articleRef.forEach((doc) => {
      db.collection('articles')
        .doc(doc.id)
        .delete()
    })
    const commentRef = await db
      .collection('comments')
      .where('user_id', '==', id)
      .get()
    commentRef.forEach((doc) => {
      db.collection('comments')
        .doc(doc.id)
        .delete()
    })
    await user.delete()
    dispatch('getUsers')
  },

  async editUser({}, id) {
    const snapShot = await db
      .collection('users')
      .doc(id)
      .get()
    const userData = await snapShot.data()
    return userData
  },

  async updateUser({ dispatch }, { id, payload }) {
    const userRef = await db.collection('users').doc(id)
    await userRef.update({
      name: payload.name,
      email: payload.email
    })
    dispatch('getUsers', payload)
  },

  async updateUserName({ commit }, payload) {
    const user = firebase.auth().currentUser
    await user
      .updateProfile({
        displayName: payload.name
      })
      .then(() => {
        console.log(user)
        console.log('success change name')
      })
    commit('setUser', _.cloneDeep(user))
  },

  async updateUserEmailAndPassword({ commit, dispatch }, { payload, user }) {
    const email = user.email
    const password = payload.password
    console.log(email, password)
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    )
    const authUser = firebase.auth().currentUser
    await authUser.reauthenticateAndRetrieveDataWithCredential(credential)
    await authUser.updateEmail(payload.email).then(() => {
      console.log(user)
      console.log('success change email')
    })
    await authUser.updatePassword(payload.newPassword).then(() => {
      console.log(authUser)
      console.log('success change password')
    })
    commit('setUser', _.cloneDeep(firebase.auth().currentUser))
    dispatch('getUsers', payload)
  }
}
