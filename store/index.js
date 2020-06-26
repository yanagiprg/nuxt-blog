/* eslint-disable no-use-before-define */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
// const usersRef = db.collection('users')

export const state = () => ({
  articles: [],
  user: null
})

export const getters = {
  articles(state) {
    return state.articles
  }
}

export const actions = {
  getArticles({ dispatch }, user) {
    db.doc(`users/${user.uid}`)
      .collection('articles')
      .get()
      .then((snapShot) => {
        const articles = []
        snapShot.forEach((doc) => {
          articles.push(doc.data())
        })
        dispatch('getArticles', articles)
      })
  },

  addArticle({ dispatch }, article, user) {
    db.doc(`users/${user.uid}`)
      .collection('articles')
      .add({})
      .then((res) => {
        db.doc(`users/${user.uid}`)
          .collection('articles')
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

  deleteArticle({ dispatch }, id, user) {
    db.doc(`users/${user.uid}`)
      .collection('articles')
      .doc(id)
      .delete()
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
