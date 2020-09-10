/* eslint-disable no-empty-pattern */
/* eslint-disable no-use-before-define */
import _ from 'lodash'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp()

export const state = () => ({
  articles: [],
  comments: [],
  user: null
})

export const getters = {
  articles(state) {
    return state.articles
  },

  user(state) {
    return state.user
  },

  comments(state) {
    return state.comments
  }
}

export const mutations = {
  setArticles(state, articles) {
    state.articles = _.cloneDeep(articles)
  },

  deleteArticle(state, index) {
    state.articles.splice(index, 1)
  },

  // setShowArticle(state, form) {
  //   state.articles[form.articleIndex] = form.snapShot
  // },

  setUser(state, user) {
    state.user = user
  },

  setComments(state, comments) {
    state.comments = _.cloneDeep(comments)
  },

  deleteComment(state, index) {
    state.comments.splice(index, 1)
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

  // async addArticle({ dispatch, state }, article) {
  //   const user = state.user
  //   const userRef = db.collection('users').doc(user.uid)
  //   const res = await db.collection('articles').add({})
  //   await db
  //     .collection('articles')
  //     .doc(res.id)
  //     .set({
  //       id: res.id,
  //       title: article.title,
  //       text: article.text,
  //       user_id: user.uid,
  //       usersRef: userRef,
  //       createdAt: timestamp,
  //       updatedAt: timestamp
  //     })
  //   dispatch('getArticles', article)
  // },

  async deleteArticle({ dispatch }, id) {
    await db
      .collection('articles')
      .doc(id)
      .delete()
    const snapShot = await db
      .collection('comments')
      .where('article_id', '==', id)
      .get()
    snapShot.forEach((doc) => {
      db.collection('comments')
        .doc(doc.id)
        .delete()
    })
    dispatch('getArticles')
  },

  async editArticle({}, id) {
    const snapShot = await db
      .collection('articles')
      .doc(id)
      .get()
    const article = await snapShot.data()
    return article
  },

  async updateArticle({ dispatch }, { id, payload }) {
    const articleRef = await db.collection('articles').doc(id)
    await articleRef.update({
      title: payload.title,
      text: payload.text,
      updatedAt: timestamp
    })
    dispatch('getArticles', payload)
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

  async addComment({ dispatch, state }, payload) {
    const user = state.user
    const userRef = db.collection('users').doc(user.uid)
    const articleRef = userRef.collection('articles').doc(payload.id)
    const res = await db.collection('comments').add({})
    await db
      .collection('comments')
      .doc(res.id)
      .set({
        id: res.id,
        user_id: user.uid,
        article_id: payload.id,
        commentText: payload.commentText,
        articlesRef: articleRef,
        createdAt: timestamp,
        updatedAt: timestamp
      })
    dispatch('getComments', payload.id)
  },

  async deleteComment({ dispatch }, payload) {
    await db
      .collection('comments')
      .doc(payload.commentId)
      .delete()
    dispatch('getComments', payload.id)
    console.log('succeed in deleting')
  },

  async editComment({}, id) {
    const snapShot = await db
      .collection('comments')
      .doc(id)
      .get()
    const comment = await snapShot.data()
    return comment
  },

  async updateComment({ dispatch }, { id, payload }) {
    const commentRef = db.collection('comments').doc(id)
    await commentRef.update({
      commentText: payload.commentText,
      updatedAt: timestamp
    })
    dispatch('getComments', payload)
    console.log('succeed in updating')
  }
}
