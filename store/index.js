/* eslint-disable no-use-before-define */
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const articlesRef = db.collection('articles')

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
  setArticle(state, index) {
    state.articles.splice(index, 1)
  }
}

export const actions = {
  async getArticles({ dispatch }, user) {
    await // db
    // .doc(`users/${user.uid}`)
    // .collection('articles')
    articlesRef.get().then((snapShot) => {
      const articles = []
      snapShot.forEach((doc) => {
        articles.push(doc.data())
      })
      dispatch('getArticles', articles)
    })
  },

  async addArticle({ dispatch }, article, user) {
    await // db
    // .doc(`users/${user.uid}`)
    // .collection('articles')
    articlesRef.add({}).then((res) => {
      // db.doc(`users/${user.uid}`)
      //   .collection('articles')
      articlesRef
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

  async deleteArticle({ dispatch }, id, user) {
    await db
      .doc(`users/${user.uid}`)
      .collection('articles')
      .doc(id)
      .delete()
    dispatch('getArticles')
    console.log('deleted')
  }
}
