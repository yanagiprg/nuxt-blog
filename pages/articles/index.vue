<template>
  <v-app>
    <div>
      <Form />
      <ArticlesList />
    </div>
  </v-app>
</template>

<script>
import ArticlesList from '~/components/articles/ArticlesList'
import Form from '~/components/articles/Form'

export default {
  components: {
    ArticlesList,
    Form
  }
}
</script>
