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
  },

  setShowComment(state, form) {
    state.users[form.userIndex] = form.snapShot
  }
}

export const actions = {
  async createUser({ state, commit }, form) {
    const user = _.cloneDeep(state.user)
    await db
      .collection('users')
      .doc(user.uid)
      .set({
        id: user.uid,
        name: form.name,
        email: form.email,
        password: form.password
      })
    user.updateProfile({
      displayName: form.name
    })
    commit('setUsers', _.cloneDeep(form))
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

  async updateUserName({ commit }, form) {
    const user = firebase.auth().currentUser
    await user
      .updateProfile({
        displayName: form.name
      })
      .then(() => {
        console.log(user)
        console.log('success change name')
      })
    commit('setUser', _.cloneDeep(user))
  },

  async updateUserEmailAndPassword({ commit }, { form, user }) {
    const email = form.email
    const password = form.password
    console.log(email, password)
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    )
    const authUser = await firebase
      .auth()
      .currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
    await authUser.updateEmail(email).then(() => {
      console.log(user)
      console.log('success change email')
    })
    await authUser.updatePassword(form.password).then(() => {
      console.log(authUser)
      console.log('success change password')
    })
    commit('setUser', _.cloneDeep(authUser))
  }
}
