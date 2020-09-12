<template>
  <v-form>
    <v-container>
      <v-row class="flex" justify="space-between">
        <v-text-field
          v-model="commentText"
          label="コメントを入力する"
        ></v-text-field>
        <v-btn @click="addComment">追加</v-btn>
      </v-row>
      <v-row>
        <v-col v-for="(comment, index) in comments" :key="index" cols="12">
          <v-card class="mx-auto teal" max-height="300px">
            <v-card-title class="pb-0 pt-1 view">
              {{ comment.commentText }}
            </v-card-title>
            <div v-if="user.uid === comment.user_id || adminUser.admin_id">
              <v-btn outlined small @click="showComment(index)">
                編集
              </v-btn>
              <v-btn outlined small @click="deleteComment(comment)">削除</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from '~/plugins/firebase'

export default {
  data() {
    return {
      id: this.$route.params.articleId,
      commentText: '',
      admin_id: ''
    }
  },

  computed: {
    ...mapGetters({
      adminUser: 'login/adminUser',
      user: 'login/user',
      comments: 'comments'
    })
  },

  mounted() {
    this.$store.dispatch('getComments', this.$route.params.articleId)
  },

  methods: {
    async addComment() {
      const db = firebase.firestore()
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      const id = this.$route.params.articleId
      const userRef = db.collection('users').doc(this.user.uid)
      const articleRef = userRef.collection('articles').doc(id)
      const res = await db.collection('comments').add({})
      await db
        .collection('comments')
        .doc(res.id)
        .set({
          id: res.id,
          user_id: this.user.uid,
          article_id: id,
          commentText: this.commentText,
          articlesRef: articleRef,
          createdAt: timestamp,
          updatedAt: timestamp
        })
      await this.$store.dispatch('getComments', id)
    },

    async deleteComment(comment) {
      const db = firebase.firestore()
      await db
        .collection('comments')
        .doc(comment.id)
        .delete()
      await this.$store.dispatch('getComments', this.$route.params.articleId)
    },

    showComment(index) {
      this.$router.push(
        `${this.$route.path}/comments/${this.comments[index].id}`
      )
    },

    resetForm() {
      window.location.reload()
    }
  }
}
</script>
