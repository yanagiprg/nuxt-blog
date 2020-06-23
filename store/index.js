/* eslint-disable no-use-before-define */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const usersRef = db.collection('users')
const userA = usersRef.doc('userA').collection('articles')

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
    userA.get().then((snapShot) => {
      const articles = []
      snapShot.forEach((doc) => {
        articles.push(doc.data())
      })
      commit('getArticles', articles)
    })
  },

  addArticle({ dispatch }, article) {
    userA.add({}).then((res) => {
      userA
        .doc(res.id)
        .set({
          id: res.id,
          title: article.title,
          text: article.text
        })
        .then(() => {
          dispatch('getArticles', article)
        })
    })
  },

  deleteArticle({ dispatch }, id) {
    userA.doc(id).delete()
    dispatch('getArticles')
    console.log('deleted')
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
