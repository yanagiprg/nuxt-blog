<template>
  <v-app>
    <v-container>
      <EditArticle
        :props-title="title"
        :props-text="text"
        :props-user-id="userId"
      />
      <CommentsList />
    </v-container>
  </v-app>
</template>

<script>
import EditArticle from '~/components/articles/EditArticle'
import CommentsList from '~/components/comments/CommentsList'

export default {
  components: {
    EditArticle,
    CommentsList
  },

  async asyncData({ store, params }) {
    const articleData = await store.dispatch('editArticle', params.articleId)
    return {
      title: articleData.title,
      text: articleData.text,
      userId: articleData.user_id
    }
  }
}
</script>
