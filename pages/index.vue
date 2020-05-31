<template>
  <v-app>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="4" required>
            <v-text-field v-model="title" label="Title"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="text" label="Text"></v-text-field>
          </v-col>
        </v-row>
        <v-btn class="mr-4" small outlined @click="addArticle()">submit</v-btn>
        <v-btn small outlined @click="resetForm()">reset</v-btn>
      </v-container>
    </v-form>
    <!-- Cards -->
    <v-container fluid>
      <v-row class="mb-2">
        <v-col
          v-for="(article, index) in articles"
          :key="index"
          cols="4"
          md="3"
          xl="2"
        >
          <v-card class="article-card mx-auto teal" max-height="100px">
            <v-card-title class="pb-0 pt-1">{{ article.title }}</v-card-title>
            <v-card-text>{{ article.text }}</v-card-text>
            <v-btn outlined @click="removeArticle(index)">Delete</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      articles: [],
      title: '',
      text: ''
      // form: {
      //   title: '',
      //   text: ''
      // }
    }
  },

  methods: {
    addArticle() {
      // const article = Object.assign({}, this.form)
      this.articles.push({
        title: this.title,
        text: this.text
      })
      this.resetForm()
    },
    removeArticle(index) {
      this.articles.splice(index, 1)
    },
    resetForm() {
      this.title = ''
      this.text = ''
    }
  }
}
</script>
