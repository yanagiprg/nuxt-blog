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
import firebase from '~/plugins/firebase'

export default {
  props: {
    propsCommentText: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      id: this.$route.params.id,
      commentText: this.propsCommentText
    }
  },

  methods: {
    async updateComment(id) {
      const db = firebase.firestore()
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      const commentRef = db.collection('comments').doc(id)
      await commentRef.update({
        commentText: this.commentText,
        updatedAt: timestamp
      })
      this.$store.dispatch('getComments', this.commentText)
      await this.$router.push(`/articles/${this.$route.params.articleId}`)
    },

    resetForm() {
      window.location.reload()
    }
  }
}
</script>
