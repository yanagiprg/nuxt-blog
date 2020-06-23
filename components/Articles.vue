<template>
  <v-app>
    <!-- Article List -->
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
            {{ user.displayName }}
            <v-btn
              outlined
              @click="$store.dispatch('/deleteArticle', articles[index].id)"
              >Delete</v-btn
            >
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  async asyncData({ store }) {
    await store.dispatch('getArticles')
  },

  computed: {
    ...mapGetters(['articles'])
  }
}
</script>
