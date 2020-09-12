<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" md="4" required>
        <span v-if="!$v.title.required">タイトルが入力されていません。</span>
        <span v-else-if="!$v.title.maxLength"
          >タイトルは8文字以内で入力してください。</span
        >
        <v-text-field
          v-model="$v.title.$model"
          :counter="8"
          label="Title"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <span v-if="!$v.text.required">テキストが入力されていません。</span>
        <v-text-field v-model="$v.text.$model" label="Text"></v-text-field>
      </v-col>
    </v-row>
    <v-btn
      class="mr-4"
      small
      outlined
      :disabled="$v.$invalid"
      @click="addArticle"
      >投稿</v-btn
    >
    <v-btn small outlined @click="resetForm">リセット</v-btn>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'
import firebase from '~/plugins/firebase'
import { validateTitle, validateText } from '~/utils/validations'

export default {
  data() {
    return {
      title: '',
      text: ''
    }
  },

  computed: {
    ...mapGetters({
      user: 'login/user'
    }),

    titleErrors() {
      return validateTitle(this.$v.title)
    },

    validateText() {
      return validateText(this.$v.text)
    }
  },

  methods: {
    async addArticle() {
      const db = firebase.firestore()
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      const userRef = db.collection('users').doc(this.user.uid)
      const res = await db.collection('articles').add({})
      await db
        .collection('articles')
        .doc(res.id)
        .set({
          id: res.id,
          title: this.title,
          text: this.text,
          user_id: this.user.uid,
          usersRef: userRef,
          createdAt: timestamp,
          updatedAt: timestamp
        })
      const article = {
        title: this.title,
        text: this.text
      }
      this.$store.dispatch('getArticles', article)
      this.resetForm()
    },

    resetForm() {
      this.$refs.form.reset()
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
