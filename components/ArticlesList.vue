<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="(article, index) in articles"
        :key="index"
        cols="6"
        md="6"
        xl="2"
      >
        <v-card class="article-card mx-auto teal" max-height="300px">
          <v-card-title class="pb-0 pt-1">{{ article.title }}</v-card-title>
          <v-card-text>{{ article.text }}</v-card-text>
          <v-btn outlined @click="editArticle(index)">Show</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      title: '',
      text: ''
    }
  },

  computed: {
    ...mapGetters({
      articles: 'articles',
      user: 'login/user'
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
