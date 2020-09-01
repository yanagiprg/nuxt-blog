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
          <div
            v-if="
              user.uid === user_id ||
                user.uid === 'Gf7pkyrQetPZCVK7cKh6BrSEeSq1'
            "
          >
            <v-btn class="mr-4" small outlined @click="deleteArticle(id)"
              >削除</v-btn
            >
            <v-btn
              class="mr-4"
              small
              outlined
              :disabled="$v.$invalid"
              @click="updateArticle(id)"
              >更新</v-btn
            >
            <v-btn small outlined @click="resetForm(article)">リセット</v-btn>
          </div>
        </v-container>
      </v-form>
      <v-form>
        <v-container>
          <v-row>
            <v-col v-for="(comment, index) in comments" :key="index" cols="12">
              <v-card class="article-card mx-auto teal" max-height="300px">
                <v-card-title class="pb-0 pt-1">
                  {{ comment.commentText }}
                </v-card-title>
                <div
                  v-if="
                    user.uid === comment.user_id ||
                      user.uid === 'Gf7pkyrQetPZCVK7cKh6BrSEeSq1'
                  "
                >
                  <v-btn
                    outlined
                    small
                    class="mr-4"
                    @click="updateComment(index)"
                    >更新</v-btn
                  >
                  <v-btn outlined small @click="deleteComment(index)"
                    >削除</v-btn
                  >
                </div>
              </v-card>
            </v-col>
            <v-row class="flex" justify="space-between">
              <v-text-field
                v-model="commentText"
                label="コメントを入力する"
              ></v-text-field>
              <v-btn @click="addComment()">追加</v-btn>
            </v-row>
          </v-row>
        </v-container>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'
import { validateTitle, validateText } from '~/utils/validations'

export default {
  async asyncData({ store, params }) {
    const articleData = await store.dispatch('editArticle', params.id)
    return {
      title: articleData.title,
      text: articleData.text,
      user_id: articleData.user_id
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
      comments: 'comments',
      user: 'login/user'
    }),

    titleErrors() {
      return validateTitle(this.$v.title)
    },
    validateText() {
      return validateText(this.$v.text)
    }
  },

  mounted() {
    this.$store.dispatch('getComments', this.$route.params.id)
  },

  methods: {
    deleteArticle(id) {
      this.$store.dispatch('deleteArticle', id)
    },

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

    addComment() {
      this.$store.dispatch('addComment', {
        id: this.$route.params.id,
        commentText: this.commentText
      })
      this.resetForm()
    },

    deleteComment(index) {
      this.$store.dispatch('deleteComment', this.comments[index].id)
    },

    updateComment(index) {
      this.$store.dispatch('updateComment', {
        id: this.comments[index].id,
        commentText: this.commentText
      })
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
