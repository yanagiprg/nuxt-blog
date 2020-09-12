/* eslint-disable no-empty-pattern */
/* eslint-disable no-use-before-define */
import _ from 'lodash'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()

export const state = () => ({
  user: null,
  articles: [],
  comments: []
})

export const getters = {
  user(state) {
    return state.user
  },

  articles(state) {
    return state.articles
  },

  comments(state) {
    return state.comments
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },

  setArticles(state, articles) {
    state.articles = _.cloneDeep(articles)
  },

  setComments(state, comments) {
    state.comments = _.cloneDeep(comments)
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

  async editArticle({}, id) {
    const snapShot = await db
      .collection('articles')
      .doc(id)
      .get()
    const article = await snapShot.data()
    return article
  },

  async getComments({ commit }, id) {
    const comments = []
    const snapShot = await db
      .collection('comments')
      .where('article_id', '==', id)
      .get()
    snapShot.forEach((doc) => {
      comments.push(doc.data())
    })
    commit('setComments', comments)
  },

  async editComment({}, id) {
    const snapShot = await db
      .collection('comments')
      .doc(id)
      .get()
    const comment = await snapShot.data()
    return comment
  }
}
