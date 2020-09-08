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
      // commentText: ''
    }
  },

  methods: {
    updateComment(id) {
      const form = { commentText: this.commentText }
      this.$store.dispatch('updateComment', { id, form })
      this.$router.push('/articles')
    },

    resetForm() {
      window.location.reload()
    }
  }
}
</script>
