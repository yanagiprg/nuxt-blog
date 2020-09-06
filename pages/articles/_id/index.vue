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
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <span v-if="!$v.text.required"
                >テキストが入力されていません。</span
              >
              <v-text-field v-model="$v.text.$model" label="Text">
              </v-text-field>
            </v-col>
          </v-row>
          <div
            v-if="
              user.uid === user_id ||
                user.uid === '7MI0Wp14EBUT6PeOK5WpO5aaBL32'
            "
          >
            <v-btn
              class="mr-4"
              small
              outlined
              :disabled="$v.$invalid"
              @click="updateArticle(id)"
              >更新</v-btn
            >
            <v-btn class="mr-4" small outlined @click="deleteArticle(id)"
              >削除</v-btn
            >
            <v-btn small outlined @click="resetForm(article)">リセット</v-btn>
          </div>
        </v-container>
      </v-form>
      <v-form>
        <v-container>
          <v-row class="flex" justify="space-between">
            <v-text-field
              v-model="commentText"
              label="コメントを入力する"
            ></v-text-field>
            <v-btn @click="addComment()">追加</v-btn>
          </v-row>
          <v-row>
            <v-col v-for="(comment, index) in comments" :key="index" cols="12">
              <v-card class="mx-auto teal" max-height="300px">
                <v-card-title class="pb-0 pt-1 view">
                  {{ comment.commentText }}
                </v-card-title>
                <div
                  v-if="
                    user.uid === comment.user_id ||
                      user.uid === '7MI0Wp14EBUT6PeOK5WpO5aaBL32'
                  "
                >
                  <v-btn outlined small @click="showComment(index)">
                    編集
                  </v-btn>
                  <v-btn outlined small @click="deleteComment(comment)"
                    >削除</v-btn
                  >
                </div>
              </v-card>
            </v-col>
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

    async addComment() {
      const form = {
        id: this.$route.params.id,
        commentText: this.commentText
      }
      await this.$store.dispatch('addComment', form)
      await this.resetForm()
    },

    async deleteComment(comment) {
      await this.$store.dispatch('deleteComment', comment.id)
      await this.resetForm()
    },

    showComment(index) {
      this.$router.push(
        `${this.$route.path}/comments/${this.comments[index].id}`
      )
    },

    resetForm() {
      window.location.reload()
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
