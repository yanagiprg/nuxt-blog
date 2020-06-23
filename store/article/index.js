import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const articlesRef = db.collection('articles')

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
    articlesRef.get().then((snapShot) => {
      const articles = []
      snapShot.forEach((doc) => {
        articles.push(doc.data())
      })
      commit('getArticles', articles)
    })
  },
  addArticle({ dispatch }, article) {
    articlesRef.add({}).then((res) => {
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
  deleteArticle({ dispatch }, id) {
    articlesRef.doc(id).delete()
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
