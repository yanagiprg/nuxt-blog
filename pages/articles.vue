<template>
  <v-container fluid>
    <nuxt-link to="/form" class="text-link">新規投稿</nuxt-link>
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      articles: [
        { title: 'TitleA', text: 'texttexttexttexttexttexttexttext' },
        { title: 'TitleB', text: 'texttexttexttexttexttexttexttext' },
        { title: 'TitleC', text: 'texttexttexttexttexttexttexttext' },
        { title: 'TitleD', text: 'texttexttexttexttexttexttexttext' }
      ]
    }
  }
}
</script>

<style>
.article-card {
  overflow: hidden;
}
</style>
