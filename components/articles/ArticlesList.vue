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
          <v-btn outlined @click="showArticle(index)">詳細</v-btn>
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
      articles: 'articles'
    })
  },

  methods: {
    showArticle(index) {
      this.$router.push(`/articles/${this.articles[index].id}`)
    }
  }
}
</script>
