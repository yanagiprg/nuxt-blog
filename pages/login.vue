<template>
  <div id="app">
    <v-app>
      <v-app>
        <v-content>
          <v-container v-if="!isLogin">
            <v-container class="fill-height" fluid>
              <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                  <v-card class="elevation-12">
                    <v-toolbar color="teal" dark flat>
                      <v-toolbar-title>Login form</v-toolbar-title>
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
                          placeholder="name"
                          prepend-icon="mdi-face"
                        ></v-text-field>
                        <span v-if="!$v.email.required"
                          >メールアドレスが入力されていません。</span
                        >
                        <span v-if="!$v.email.email"
                          >不正なメールアドレスです。</span
                        >
                        <v-text-field
                          v-model="$v.email.$model"
                          type="text"
                          placeholder="email"
                          prepend-icon="mdi-email"
                        ></v-text-field>
                        <span v-if="!$v.password.required"
                          >パスワードが入力されていません。</span
                        >
                        <span v-if="!$v.password.strongPassword"
                          >パスワードは英数字混合で8文字以上で入力てください。</span
                        >
                        <v-text-field
                          v-model="$v.password.$model"
                          type="password"
                          placeholder="password"
                          prepend-icon="mdi-lock"
                        ></v-text-field>
                        <p>
                          <v-checkbox
                            v-model="register"
                            type="checkbox"
                            label="新規登録"
                          ></v-checkbox>
                        </p>
                        <v-btn
                          color="teal"
                          class="mb-4 mr-4"
                          :disabled="$v.$invalid"
                          @click="signup"
                          >{{ register ? '新規登録' : 'ログイン' }}</v-btn
                        >
                        <!-- <v-btn
                          color="teal"
                          outlined
                          class="mb-4"
                          @click="loginWithGoogle"
                          >Google</v-btn
                        > -->
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
          <v-container v-else>
            <p>{{ user.email }}でログイン中</p>
            <v-btn color="teal" @click="logout">ログアウト</v-btn>
          </v-container>
        </v-content>
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
  validatePassword
} from '~/utils/validations'

export default {
  data() {
    return {
      register: false,
      isWaiting: true,
      name: '',
      email: '',
      password: '',
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
    }
  },

  methods: {
    async signup() {
      const form = {
        email: this.$v.email.$model,
        password: this.$v.password.$model,
        name: this.$v.name.$model
      }
      if (this.register) {
        console.log(form)
        await this.$store.dispatch('login/signup', form)
        await this.$store.dispatch('login/createUser', form)
        this.$router.push('/articles')
      } else {
        await this.$store.dispatch('login/loginWithPassword', form)
      }
    },
    async logout() {
      await this.$store.dispatch('login/logout')
    }
    // async loginWithGoogle() {
    //   await this.$store.dispatch('login/loginWithGoogle')
    //   await this.$router.push('/articles')
    // },
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
    }
  }
}
</script>
