/* eslint-disable no-empty-pattern */
/* eslint-disable no-use-before-define */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp()

export const state = () => ({
  articles: [],
  user: null,
  isLogin: false
})

export const getters = {
  articles(state) {
    return state.articles
  },

  user(state) {
    return state.user
  }
}

export const mutations = {
  getArticles(state, articles) {
    state.articles = articles
  },

  deleteArticle(state, index) {
    state.articles.splice(index, 1)
  },

  getUser(state, user) {
    state.user = user
  },

  setLogin(state, isLogin) {
    if (isLogin === false) {
      return (state.isLogin = true)
    }
  }
}

export const actions = {
  async getArticles({ commit, state }) {
    const user = state.user
    const articles = []
    const snapShot = await db
      .doc(`users/${user.uid}`)
      .collection('articles')
      .orderBy('updatedAt', 'desc')
      .get()
    snapShot.forEach((doc) => {
      articles.push(doc.data())
    })
    commit('getArticles', articles)
  },

  async addArticle({ dispatch, state }, article) {
    const user = state.user
    const userRef = db
      .collection('users')
      .doc(user.uid)
      .collection('articles')
    const res = userRef.doc()
    await res.set({
      id: res.id,
      title: article.title,
      text: article.text,
      createdAt: timestamp,
      updatedAt: timestamp
    })
    dispatch('getArticles', article)
  },

  async deleteArticle({ dispatch, state }, id) {
    const user = state.user
    await db
      .collection('users')
      .doc(user.uid)
      .collection('articles')
      .doc(id)
      .delete()
    dispatch('getArticles')
    console.log('succeed in deleting')
  },

  async editArticle({ state }, id) {
    const user = state.user
    const snapShot = await db
      .collection('users')
      .doc(user.uid)
      .collection('articles')
      .doc(id)
      .get()
    const articleIndex = this.state.articles.findIndex(
      (article) => article.id === snapShot.id
    )
    this.state.articles[articleIndex] = snapShot.data()
  },

  async showArticle({ state }, id) {
    const user = state.user
    const snapShot = await db
      .collection('users')
      .doc(user.uid)
      .collection('articles')
      .doc(id)
      .get()
    const article = await snapShot.data()
    return article
  },

  async updateArticle({ dispatch, state }, { id, form }) {
    const user = state.user
    const articleRef = await db
      .collection('users')
      .doc(user.uid)
      .collection('articles')
      .doc(id)
    await articleRef.update({
      title: form.title,
      text: form.text,
      updatedAt: timestamp
    })
    dispatch('getArticles', form)
  }
}
