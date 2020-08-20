<template>
  <v-app>
    <Form />
    <ArticlesList />
  </v-app>
</template>

<script>
import _ from 'lodash'
import ArticlesList from '~/components/ArticlesList'
import Form from '~/components/Form'
import firebase from '~/plugins/firebase'

export default {
  components: {
    ArticlesList,
    Form
  },

  computed: {
    getArticles: async () => {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user)
          this.isLogin = true
          this.user = user
          this.email = user.email
          console.log('beforeCreate/articles.vue')
          this.$store.commit('getUser', _.cloneDeep(user))
        } else {
          this.isLogin = false
          this.user = []
          this.$router.push('/login')
        }
      })
      console.log('computed/getArticles')
      await this.$store.dispatch('getArticles')
    }
  }
}
</script>
