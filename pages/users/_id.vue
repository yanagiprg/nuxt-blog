<template>
  <div id="app">
    <v-app>
      <v-app>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar v-if="!admin_id" color="teal" dark flat>
                <v-toolbar-title>Edit User Form</v-toolbar-title>
              </v-toolbar>
              <v-toolbar v-else color="light-blue darken-4" dark flat>
                <v-toolbar-title
                  >Edit User Form（管理者ユーザーです）</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <p v-if="errorMessage">{{ errorMessage }}</p>
                  <span v-if="!$v.name.required"
                    >名前が入力されていません。</span
                  >
                  <span v-if="!$v.name.maxLength"
                    >名前が16文字以内で入力してください。</span
                  >
                  <v-text-field
                    v-model="$v.name.$model"
                    :counter="16"
                    type="text"
                    placeholder="名前"
                    prepend-icon="mdi-face"
                  ></v-text-field>
                  <span v-if="!$v.email.required"
                    >メールアドレスが入力されていません。</span
                  >
                  <span v-if="!$v.email.email">不正なメールアドレスです。</span>
                  <v-text-field
                    v-model="$v.email.$model"
                    type="text"
                    placeholder="Eメールアドレス"
                    prepend-icon="mdi-email"
                  ></v-text-field>
                  <span v-if="!$v.password.required"
                    >パスワードが入力されていません。</span
                  >
                  <span v-if="!$v.password.strongPassword"
                    ><br />パスワードは英数字混合で8文字以上で入力てください。</span
                  >
                  <v-text-field
                    v-model="$v.password.$model"
                    type="password"
                    placeholder="現在のパスワード"
                    prepend-icon="mdi-lock"
                  ></v-text-field>
                  <span v-if="!$v.newPassword.required"
                    >パスワードが入力されていません。</span
                  >
                  <span v-if="!$v.newPassword.strongPassword"
                    ><br />パスワードは英数字混合で8文字以上で入力てください。<br
                  /></span>
                  <v-text-field
                    v-model="$v.newPassword.$model"
                    type="password"
                    placeholder="新しいパスワード"
                    prepend-icon="mdi-lock"
                  ></v-text-field>
                  <v-btn
                    v-if="!admin_id"
                    color="teal"
                    class="mb-4 mr-4"
                    :disabled="$v.$invalid"
                    @click="updateUser"
                    >更新</v-btn
                  >
                  <v-btn
                    v-else
                    color="light-blue darken-4"
                    class="mb-4 mr-4"
                    :disabled="$v.$invalid"
                    @click="updateUser"
                    >更新</v-btn
                  >
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-app>
    </v-app>
  </div>
</template>

<script>
import { required, email, maxLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateNewPassword
} from '~/utils/validations'

export default {
  async asyncData({ store, params }) {
    const userData = await store.dispatch('login/editUser', params.id)
    return {
      name: userData.name,
      email: userData.email,
      admin_id: userData.admin_id
    }
  },

  data() {
    return {
      id: this.$route.params.id,
      password: '',
      newPassword: '',
      errorMessage: ''
    }
  },

  computed: {
    ...mapGetters({
      user: 'login/user',
      isLogin: 'login/isLogin'
    }),

    nameErrors() {
      return validateName(this.$v.name)
    },

    emailErrors() {
      return validateEmail(this.$v.email)
    },

    passwordErros() {
      return validatePassword(this.$v.password)
    },

    newPasswordErrors() {
      return validateNewPassword(this.$v.newPassword)
    }
  },

  methods: {
    updateUser() {
      const id = this.$route.params.id
      const payload = {
        name: this.name,
        email: this.email,
        password: this.password,
        newPassword: this.newPassword
      }
      this.$store.dispatch('login/updateUser', { id, payload })
      this.$store.dispatch('login/updateUserName', {
        payload,
        user: this.user
      })
      this.$store.dispatch('login/updateUserEmailAndPassword', {
        payload,
        user: this.user
      })
      this.$router.push('/users')
    },

    resetForm() {
      window.location.reload()
    }
  },

  validations: {
    name: {
      required,
      maxLength: maxLength(16)
    },

    email: {
      required,
      email
    },

    password: {
      required,
      strongPassword(password) {
        return (
          /[a-z]/.test(password) && // checks for a-z
          /[0-9]/.test(password) && // checks for 0-9
          password.length >= 8
        )
      }
    },

    newPassword: {
      required,
      strongPassword(newPassword) {
        return (
          /[a-z]/.test(newPassword) && // checks for a-z
          /[0-9]/.test(newPassword) && // checks for 0-9
          newPassword.length >= 8
        )
      }
    }
  }
}
</script>
