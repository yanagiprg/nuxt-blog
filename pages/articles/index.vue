<template>
  <v-app>
    <div>
      <Form />
      <ArticlesList />
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticlesList from '~/components/ArticlesList'
import Form from '~/components/Form'

export default {
  components: {
    ArticlesList,
    Form
  },

  computed: {
    ...mapGetters({
      user: 'user'
    })
  }
}
</script>
