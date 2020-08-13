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
export default {
  async asyncData({ store, params }) {
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

  methods: {
    updateArticle(id) {
      const form = {
        title: this.title,
        text: this.text
      }
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
