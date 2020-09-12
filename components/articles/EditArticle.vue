<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <span v-if="!$v.title.required">タイトルが入力されていません。</span>
          <span v-else-if="!$v.title.maxLength"
            >タイトルは8文字以内で入力してください。</span
          >
          <v-text-field v-model="$v.title.$model" :counter="8" label="Title">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <span v-if="!$v.text.required">テキストが入力されていません。</span>
          <v-text-field v-model="$v.text.$model" label="Text"> </v-text-field>
        </v-col>
      </v-row>
      <div v-if="user.uid === userId || adminUser.admin_id">
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
        <v-btn small outlined @click="resetForm">リセット</v-btn>
      </div>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'
import firebase from '~/plugins/firebase'
import { validateTitle, validateText } from '~/utils/validations'

export default {
  props: {
    propsTitle: {
      type: String,
      required: true
    },
    propsText: {
      type: String,
      required: true
    },
    propsUserId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      id: this.$route.params.articleId,
      admin_id: '',
      title: this.propsTitle,
      text: this.propsText,
      userId: this.propsUserId
    }
  },

  computed: {
    ...mapGetters({
      adminUser: 'login/adminUser',
      user: 'login/user',
      articles: 'articles'
    }),

    titleErrors() {
      return validateTitle(this.$v.title)
    },
    validateText() {
      return validateText(this.$v.text)
    }
  },

  mounted() {
    this.$store.dispatch('editArticle', this.$route.params.articleId)
  },

  methods: {
    async deleteArticle(id) {
      const db = firebase.firestore()
      await db
        .collection('articles')
        .doc(id)
        .delete()
      const snapShot = await db
        .collection('comments')
        .where('article_id', '==', id)
        .get()
      snapShot.forEach((doc) => {
        db.collection('comments')
          .doc(doc.id)
          .delete()
      })
      this.$store.dispatch('getArticles')
      this.$router.push('/articles')
    },

    async updateArticle(id) {
      const db = firebase.firestore()
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      const articleRef = await db.collection('articles').doc(id)
      await articleRef.update({
        title: this.title,
        text: this.text,
        updatedAt: timestamp
      })
      const article = {
        title: this.title,
        text: this.text
      }
      this.$store.dispatch('getArticles', article)
      await this.$router.push('/articles')
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
