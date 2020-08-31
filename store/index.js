/* eslint-disable object-shorthand */
/* eslint-disable no-empty-pattern */
/* eslint-disable no-use-before-define */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp()

export const state = () => ({
  articles: [],
  comments: [],
  user: null
})

export const getters = {
  articles(state) {
    return state.articles
  },

  user(state) {
    return state.user
  },

  comments(state) {
    return state.comments
  }
}

export const mutations = {
  setArticles(state, articles) {
    state.articles = articles
  },

  deleteArticle(state, index) {
    state.articles.splice(index, 1)
  },

  setUser(state, user) {
    state.user = user
  },

  setComments(state, comments) {
    state.comments = comments
  },

  deleteComment(state, index) {
    state.comments.splice(index, 1)
  }
}

export const actions = {
  async getArticles({ commit }) {
    const articles = []
    const snapShot = await db
      .collection('articles')
      .orderBy('updatedAt', 'desc')
      .get()
    snapShot.forEach((doc) => {
      articles.push(doc.data())
    })
    commit('setArticles', articles)
  },

  async addArticle({ dispatch, state }, article) {
    const user = state.user
    const userRef = db.collection('users').doc(user.uid)
    const res = await db.collection('articles').add({})
    await db
      .collection('articles')
      .doc(res.id)
      .set({
        id: res.id,
        title: article.title,
        text: article.text,
        user_id: user.uid,
        usersRef: userRef,
        createdAt: timestamp,
        updatedAt: timestamp
      })
    dispatch('getArticles', article)
  },

  async deleteArticle({ dispatch }, id) {
    await db
      .collection('articles')
      .doc(id)
      .delete()
    dispatch('getArticles')
    console.log('succeed in deleting')
  },

  async showArticle({}, id) {
    const snapShot = await db
      .collection('articles')
      .doc(id)
      .get()
    const articleIndex = this.state.articles.findIndex(
      (article) => article.id === snapShot.id
    )
    this.state.articles[articleIndex] = snapShot.data()
  },

  async editArticle({}, id) {
    const snapShot = await db
      .collection('articles')
      .doc(id)
      .get()
    const article = await snapShot.data()
    return article
  },

  async updateArticle({ dispatch }, { id, form }) {
    const articleRef = await db.collection('articles').doc(id)
    await articleRef.update({
      title: form.title,
      text: form.text,
      updatedAt: timestamp
    })
    dispatch('getArticles', form)
  },

  async getComments({ commit, state }, id) {
    console.log(id)
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

  async addComment({ dispatch, state }, comment) {
    const user = state.user
    const userRef = db.collection('users').doc(user.uid)
    const articleRef = userRef.collection('articles').doc(comment.id)
    const res = await db.collection('comments').add({})
    await db
      .collection('comments')
      .doc(res.id)
      .set({
        id: res.id,
        commentText: comment.commentText,
        user_id: user.uid,
        articlesRef: articleRef,
        createdAt: timestamp
      })
    dispatch('getComments', comment)
  },

  async deleteComment({ dispatch }, id) {
    await db
      .collection('comments')
      .doc(id)
      .delete()
    dispatch('getComments')
  }
}
