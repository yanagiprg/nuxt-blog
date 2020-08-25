<template>
  <v-app>
    <div v-if="user">
      <Form />
      <ArticlesList />
    </div>
    <div v-else>
      <nuxt-link to="/login" class="text-link">ログインしてください</nuxt-link>
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
      user: 'login/user'
    })
  }
}
</script>
