<template>
  <v-app>
    <Form />
    <ArticlesList />
  </v-app>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters } from 'vuex'
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

  data() {
    return {
      title: '',
      text: ''
    }
  },

  computed: {
    ...mapGetters(['articles'])
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
  },

  methods: {
    addArticle() {
      this.$store.dispatch('addArticle', { title: this.title, text: this.text })
      this.resetForm()
    },
    deleteArticle(index) {
      this.$store.dispatch('deleteArticle', this.articles[index].id)
    },
    resetForm() {
      this.title = ''
      this.text = ''
    },
    editArticle(index) {
      this.$store.dispatch('editArticle', this.articles[index].id)
      this.$router.push(`/articles/${this.articles[index].id}`)
    }
  }
}
</script>
