/* eslint-disable no-empty-pattern */
/* eslint-disable no-use-before-define */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp()

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
  setArticles(state, articles) {
    state.articles = articles
  },

  deleteArticle(state, index) {
    state.articles.splice(index, 1)
  },

  setUser(state, user) {
    state.user = user
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

  async editArticle({}, id) {
    const snapShot = await db
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
  }
}
