/* eslint-disable object-shorthand */
/* eslint-disable no-empty-pattern */
/* eslint-disable no-use-before-define */
import _ from 'lodash'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp()

export const state = () => ({
  articles: [],
  comments: [],
  user: null,
  isLoading: false
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
  },

  isLoading(state) {
    return state.isLoading
  }
}

export const mutations = {
  setArticles(state, articles) {
    state.articles = _.cloneDeep(articles)
  },

  deleteArticle(state, index) {
    state.articles.splice(index, 1)
  },

  setShowArticle(state, form) {
    state.articles[form.articleIndex] = form.snapShot
  },

  setUser(state, user) {
    state.user = user
  },

  setComments(state, comments) {
    state.comments = _.cloneDeep(comments)
  },

  deleteComment(state, index) {
    state.comments.splice(index, 1)
  },

  setShowComment(state, form) {
    state.comments[form.commentIndex] = form.snapShot
  },

  setIsLoading(state, isLoading) {
    state.isLoading = isLoading
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
  },

  async getComments({ commit }, id) {
    console.log('getComments')
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

  async addComment({ dispatch, state }, comment) {
    console.log(comment.commentText, 1)
    const user = state.user
    const userRef = db.collection('users').doc(user.uid)
    const articleRef = userRef.collection('articles').doc(comment.id)
    const res = await db.collection('comments').add({})
    console.log(comment.commentText, 2)
    await db
      .collection('comments')
      .doc(res.id)
      .set({
        id: res.id,
        user_id: user.uid,
        article_id: comment.id,
        commentText: comment.commentText,
        articlesRef: articleRef,
        createdAt: timestamp,
        updatedAt: timestamp
      })
    console.log(comment.commentText, 3)
    dispatch('getComments', comment)
  },

  async deleteComment({ dispatch }, id) {
    await db
      .collection('comments')
      .doc(id)
      .delete()
    dispatch('getComments')
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

  async updateComment({ dispatch }, { id, form }) {
    const commentRef = db.collection('comments').doc(id)
    await commentRef.update({
      commentText: form.commentText,
      updatedAt: timestamp
    })
    dispatch('getComments', form)
  }
}
