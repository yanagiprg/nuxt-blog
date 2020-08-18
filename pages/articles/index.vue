<template>
  <v-app>
    <Form />
    <ArticlesList />
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

  computed: {
    getArticles: () => {
      return this.$store.dispatch('getArticles')
    }
  }
}
</script>
