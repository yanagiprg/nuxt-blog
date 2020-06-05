export const state = () => ({
  articles: []
})

export const getters = {
  articles(state) {
    return state.articles
  }
}

export const actions = {}

export const mutations = {
  addArticle(state, payload) {
    state.articles.push(payload)
  },
  deleteArticle(state, index) {
    state.articles.splice(index, 1)
  }
}
