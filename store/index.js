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
        text: article.text
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
    const article = await snapShot.data()
    article.id = snapShot.id
    return article
  }
}
