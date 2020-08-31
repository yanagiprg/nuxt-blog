/* eslint-disable no-empty-pattern */
/* eslint-disable no-use-before-define */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp()

export const state = () => ({
  comments: [],
  user: null
})

export const getters = {
  comments(state) {
    return state.comments
  },

  user(state) {
    return state.user
  }
}

export const mutations = {
  setComments(state, comments) {
    state.comments = comments
  },

  deleteComment(state, index) {
    state.comments.splice(index, 1)
  },

  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  async getComments({ commit, state }, id) {
    const user = state.user
    const comments = []
    const snapShot = await db
      .collection('users')
      .doc(user.uid)
      .collection('articles')
      .doc(id)
      .collection('comments')
      .get()
    snapShot.forEach((doc) => {
      comments.push(doc.data())
    })
    commit('setComments', comments)
  },

  async addComment({ dispatch, state }, { id, commentText }) {
    const user = state.user
    console.log(id, user)
    const userRef = db.collection('users').doc(user.uid)
    const articleRef = userRef.collection('articles').doc(id)
    const res = await db.collection('comments').add({})
    await db
      .collection('comments')
      .doc(res.id)
      .set({
        id: res.id,
        commentText: this.commentText,
        user_id: user.uid,
        articlesRef: articleRef,
        createdAt: timestamp,
        updatedAt: timestamp
      })
    dispatch('getArticles', commentText)
  },

  async deleteComment({ dispatch }, id) {
    await db
      .collection('comments')
      .doc(id)
      .delete()
    dispatch('getComments')
  }
}
