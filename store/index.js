/* eslint-disable no-empty-pattern */
/* eslint-disable no-use-before-define */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()

export const state = () => ({
  articles: [],
  user: null
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
  }
}

export const actions = {
  async getArticles({ commit, state }) {
    // const user = state.user
    // const articles = []
    // const snapShot = await db
    //   // .collection('users')
    //   // .doc(user.uid)
    //   .collection('articles')
    //   .orderBy('updatedAt', 'desc')
    //   .get()
    // snapShot.forEach((doc) => {
    //   articles.push(doc.data())
    // })
    // commit('getArticles', articles)
  },

  async addArticle({ dispatch }, { article }) {
    const res = await db
      // .doc(`users/${user.uid}`)
      .collection('articles')
      .add({})
    await db
      // .doc(`users/${user.uid}`)
      .collection('articles')
      .doc(res.id)
      .set({
        id: res.id,
        title: article.title,
        text: article.text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    dispatch(
      'getArticles',
      article
      // user
    )
  },

  async deleteArticle({ dispatch }, id) {
    await db
      // .doc(`users/${user.uid}`)
      .collection('articles')
      .doc(id)
      .delete()
    dispatch(
      'getArticles'
      // user
    )
  },

  async editArticle({}, id) {
    const snapShot = await db
      // .doc(`users/${user.uid}`)
      .collection('articles')
      .doc(id)
      .get()
    const articleIndex = this.state.articles.findIndex(
      (article) => article.id === snapShot.id
    )
    this.state.articles[articleIndex] = snapShot.data()
  },

  async showArticle({}, id) {
    const snapShot = await db
      // .doc(`users/${user.uid}`)
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
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    dispatch('getArticles', form)
  }
}
