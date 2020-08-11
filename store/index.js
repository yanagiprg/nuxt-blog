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
  }
  // article(state) {
  //   return state.article
  // }
}

export const mutations = {
  getArticles(state, articles) {
    state.articles = articles
  },

  deleteArticle(state, index) {
    state.articles.splice(index, 1)
  }
}

export const actions = {
  async getArticles({ commit }, user) {
    const articles = []
    const snapShot = await db
      // .doc(`users/${user.uid}`)
      .collection('articles')
      .orderBy('updatedAt', 'desc')
      .get()
    snapShot.forEach((doc) => {
      articles.push(doc.data())
    })
    commit('getArticles', articles)
  },

  async addArticle({ dispatch }, article, user) {
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
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    dispatch(
      'getArticles',
      article
      // user
    )
  },

  async deleteArticle({ dispatch }, id, user) {
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
