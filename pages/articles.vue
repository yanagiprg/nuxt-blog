<template>
  <v-app>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="4" required>
            <v-text-field v-model="title" label="Title"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="text" label="Text"></v-text-field>
          </v-col>
        </v-row>
        <v-btn class="mr-4" small outlined @click="addArticle">submit</v-btn>
        <v-btn small outlined @click="resetForm()">reset</v-btn>
      </v-container>
    </v-form>
    <!-- Cards -->
    <v-container fluid>
      <v-row class="mb-2">
        <v-col
          v-for="(article, index) in articles"
          :key="index"
          cols="4"
          md="3"
          xl="2"
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
import firebase from '@/plugins/firebase'

export default {
  async asyncData({ store }) {
    await store.dispatch('setArticles')
  },
  data() {
    return {
      title: '',
      text: '',
      isWaiting: true,
      isLogin: false
    }
  },
  computed: {
    ...mapGetters(['articles'])
  },

  async mounted() {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid
      }
      this.isWaiting = false
      this.errorMessage = ''
      if (user) {
        this.isLogin = true
        this.user = user
      } else {
        this.isLogin = false
        this.user = []
      }
    })
  },

  created() {
    this.$store.dispatch('setArticles')
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
    }
  }
}
</script>
