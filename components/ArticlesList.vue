<template>
  <v-app>
    <!-- Article List -->
    <v-container fluid>
      <v-row class="mb-2">
        <v-col
          v-for="(article, index) in articles"
          :key="index"
          cols="4"
          md="3"
          xl="2"
          @click="editArticle(index)"
        >
          <v-card class="article-card mx-auto teal" max-height="100px">
            <v-card-title class="pb-0 pt-1">{{ article.title }}</v-card-title>
            <v-card-text>{{ article.text }}</v-card-text>
            <v-btn outlined @click="deleteArticle(index)">Delete</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters } from 'vuex'
import firebase from '~/plugins/firebase'

export default {
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
    deleteArticle(index) {
      this.$store.dispatch('deleteArticle', this.articles[index].id)
    },
    editArticle(index) {
      this.$store.dispatch('editArticle', this.articles[index].id)
      this.$router.push(`/articles/${this.articles[index].id}`)
    }
  }
}
</script>
