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
            <v-btn outlined @click="deleteArticle">Delete</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters } from 'vuex'

export default {
  async fetch({ store }) {
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

  methods: {
    addArticle() {
      this.$store.dispatch('addArticle', { title: this.title, text: this.text })
      this.resetForm()
    },
    deleteArticle(index) {
      this.$store.commit('deleteArticle', index)
    },
    resetForm() {
      this.title = ''
      this.text = ''
    }
  }
}
</script>
