/* eslint-disable no-undef */
/* eslint-disable object-shorthand */
import firebase from '~/plugins/firebase'

export const state = () => ({
  articles: []
})

export const getters = {
  articles(state) {
    return state.articles
  }
}

export const actions = {
  getArticles({ commit }) {
    firebase
      .firestore()
      .collection('articles')
      .get()
      .then((res) => {
        const articles = []
        res.forEach((x) => {
          console.log(x.data())
          articles.push(x.data())
        })
        commit('getArticles', articles)
      })
  },
  addArticle({ dispatch }, article) {
    firebase
      .firestore()
      .collection('articles')
      .add({})
      .then((res) => {
        firebase
          .firestore()
          .collection('articles')
          .doc(res.id)
          .set({
            id: res.id,
            title: article.title,
            text: article.text
          })
          .then(() => {
            dispatch('getArticles', article)
            console.log(article, res.id)
          })
      })
  },
  deleteArticle({ dispatch }, id) {
    firebase
      .firestore()
      .collection('articles')
      .doc(id)
      .delete()
    dispatch('getArticles')
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
