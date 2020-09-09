<template>
  <v-app>
    <v-row>
      <v-col>
        <v-text-field v-model="commentText" label="コメント"></v-text-field>
        <v-btn outlined small class="mr-4" @click="updateComment(id)"
          >更新</v-btn
        >
        <v-btn outlined small @click="resetForm">リセット</v-btn>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  async asyncData({ store, params }) {
    const commentData = await store.dispatch('editComment', params.id)
    return {
      commentText: commentData.commentText
    }
  },

  data() {
    return {
      id: this.$route.params.id
    }
  },

  methods: {
    async updateComment(id) {
      const payload = { commentText: this.commentText }
      await this.$store.dispatch('updateComment', { id, payload })
      await this.$router.push(`/articles/${this.$route.params.articleId}`)
    },

    resetForm() {
      window.location.reload()
    }
  }
}
</script>
