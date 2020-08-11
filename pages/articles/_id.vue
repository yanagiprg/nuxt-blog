<template>
  <v-app>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="4" required>
            <v-text-field v-model="title" label="Title">
              {{ title }}
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="text" label="Text">
              {{ text }}
            </v-text-field>
          </v-col>
        </v-row>
        <v-btn class="mr-4" small outlined @click="updateArticle(id)"
          >update</v-btn
        >
        <v-btn small outlined @click="resetForm(article)">reset</v-btn>
      </v-container>
    </v-form>
  </v-app>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  async asyncData({ store, params }) {
    // eslint-disable-next-line no-unused-vars
    const article = await store.dispatch('showArticle', params.id)
    return { title: article.title, text: article.text }
  },

  data() {
    return {
      id: this.$route.params.id,
      title: '',
      text: ''
    }
  },

  async mounted() {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid
        this.isLogin = true
        this.user = user
      } else {
        this.isLogin = false
        this.user = []
      }
    })
  },

  methods: {
    updateArticle(id) {
      const form = {
        title: this.title,
        text: this.text
      }
      console.log(id)
      this.$store.dispatch('updateArticle', {
        id,
        form
      })
      this.$router.push('/articles')
    },

    resetForm() {
      window.location.reload()
    }
  }
}
</script>
