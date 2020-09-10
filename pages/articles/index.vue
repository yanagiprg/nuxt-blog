<template>
  <v-app>
    <div>
      <Form @submit="addArticle" />
      <ArticlesList />
    </div>
  </v-app>
</template>

<script>
import ArticlesList from '~/components/ArticlesList'
import Form from '~/components/Form'

export default {
  components: {
    ArticlesList,
    Form
  },

  data() {
    return {
      articles: []
    }
  },

  methods: {
    addArticle(article) {
      this.articles.push(article)
    }
  }
}
</script>
