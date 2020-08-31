<template>
  <v-app>
    <v-container>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <span v-if="!$v.title.required"
                >タイトルが入力されていません。</span
              >
              <span v-else-if="!$v.title.maxLength"
                >タイトルは8文字以内で入力してください。</span
              >
              <v-text-field
                v-model="$v.title.$model"
                :counter="8"
                label="Title"
              >
                {{ title }}
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <span v-if="!$v.text.required"
                >テキストが入力されていません。</span
              >
              <v-text-field v-model="$v.text.$model" label="Text">
                {{ text }}
              </v-text-field>
            </v-col>
          </v-row>
          <v-btn
            v-if="user.uid === user_id"
            outlined
            @click="deleteArticle(index)"
            >Delete</v-btn
          >
          <v-btn
            v-else-if="user.uid == 'Gf7pkyrQetPZCVK7cKh6BrSEeSq1'"
            outlined
            @click="deleteArticle(index)"
            >Delete</v-btn
          >
          <v-btn
            class="mr-4"
            small
            outlined
            :disabled="$v.$invalid"
            @click="updateArticle(id)"
            >update</v-btn
          >
          <v-btn small outlined @click="resetForm(article)">reset</v-btn>
        </v-container>
      </v-form>
      <v-row>
        <v-col
          v-for="(comment, index) in comments"
          :key="index"
          cols="6"
          md="6"
          xl="2"
        >
          <v-card class="article-card mx-auto teal" max-height="300px">
            <v-card-title class="pb-0 pt-1">
              {{ comment.commentText }}
            </v-card-title>
            <!-- <v-btn outlined @click="updateComment(index)">Update</v-btn> -->
            <v-btn outlined @click="deleteComment(index)">Delete</v-btn>
          </v-card>
        </v-col>
        <v-row class="flex" justify="space-between">
          <v-text-field
            v-model="commentText"
            label="コメントを入力する"
          ></v-text-field>
          <v-btn @click="addComment(id)">追加</v-btn>
        </v-row>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'
import { validateTitle, validateText } from '~/utils/validations'

export default {
  async asyncData({ store, params }) {
    const article = await store.dispatch('showArticle', params.id)
    return {
      title: article.title,
      text: article.text,
      user_id: article.user_id
    }
  },

  data() {
    return {
      id: this.$route.params.id,
      commentText: ''
    }
  },

  computed: {
    ...mapGetters({
      articles: 'articles',
      user: 'user'
    }),

    titleErrors() {
      return validateTitle(this.$v.title)
    },
    validateText() {
      return validateText(this.$v.text)
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
    },

    addComment({ params }) {
      this.$store.dispatch(
        'comments/addComment',
        this.$route.params.id,
        this.commentText
      )
      console.log(this.$route.params.id, params.id)
    },

    updateComment(index) {
      this.$store.dispatch('comments/updateComment', this.comments[index].id)
    },

    deleteComment(index) {
      this.$store.dispatch('comments/deleteComment', this.comments[index].id)
    }
  },

  validations: {
    title: {
      required,
      maxLength: maxLength(8)
    },
    text: {
      required
    }
  }
}
</script>
