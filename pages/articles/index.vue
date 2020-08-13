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

  async asyncData({ store }) {
    await store.dispatch('getArticles')
  }
}
</script>
