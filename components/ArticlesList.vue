<template>
  <v-container fluid>
    <v-row>
      <!-- {{ admin_id }} -->
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
          <div v-if="article.user_id === user.uid">
            <v-btn outlined @click="editArticle(index)">Edit</v-btn>
            <v-btn outlined @click="deleteArticle(index)">Delete</v-btn>
          </div>
          <div v-else-if="user.uid == 'Gf7pkyrQetPZCVK7cKh6BrSEeSq1'">
            <v-btn outlined @click="editArticle(index)">Edit</v-btn>
            <v-btn outlined @click="deleteArticle(index)">Delete</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  // async asyncData({ store }) {
  //   const user = await store.dispatch('login/getAdmin')
  //   return {
  //     id: user.id,
  //     name: user.name,
  //     email: user.email,
  //     password: user.password,
  //     admin_id: user.admin_id
  //   }
  // },

  data() {
    return {
      title: '',
      text: '',
      user_id: ''
    }
  },

  computed: {
    ...mapGetters({
      articles: 'articles',
      user: 'login/user',
      users: 'login/users'
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
