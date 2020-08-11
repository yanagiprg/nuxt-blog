<template>
  <v-app>
    <Form />
    <ArticlesList />
  </v-app>
</template>

<script>
import firebase from '~/plugins/firebase'

import ArticlesList from '~/components/ArticlesList'
import Form from '~/components/Form'

export default {
  components: {
    ArticlesList,
    Form
  },

  async asyncData({ store }) {
    await store.dispatch('getArticles')
  },

  async mounted() {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid
        this.isLogin = true
        this.user = user
      } else {
        this.isLogin = false
        this.user = []
      }
    })
  }
}
</script>
