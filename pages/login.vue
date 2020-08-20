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
                        <!-- <p v-if="errorMessage">{{ errorMessage }}</p> -->
                        <v-text-field
                          v-model="$v.name.$model"
                          :counter="16"
                          type="text"
                          placeholder="name"
                          prepend-icon="mdi-face"
                        ></v-text-field>
                        <v-text-field
                          v-model="$v.email.$model"
                          type="text"
                          placeholder="email"
                          prepend-icon="mdi-email"
                        ></v-text-field>
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
                        <v-btn
                          color="teal"
                          outlined
                          class="mb-4"
                          @click="loginWithGoogle"
                          >Google</v-btn
                        >
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
import _ from 'lodash'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import firebase from '~/plugins/firebase'
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
      isLogin: false,
      name: '',
      email: '',
      password: '',
      errorMessage: ''
    }
  },

  computed: {
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

  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      this.isWaiting = false
      this.errorMessage = ''
      if (user) {
        this.isLogin = true
        this.user = user
        this.$store.commit('login/setUser', _.cloneDeep(user))
      } else {
        this.isLogin = false
        this.user = []
      }
    })
  },

  methods: {
    async signup() {
      const form = {
        email: this.email,
        password: this.password,
        name: this.name
      }
      if (this.register) {
        await this.$store.dispatch('login/signup', form)
        await this.$store.dispatch('login/createUser', form)
      } else {
        await this.$store.dispatch('login/loginWithPassword', form)
      }
    },
    async loginWithGoogle() {
      await this.$store.dispatch('login/loginWithGoogle')
      await this.$router.push('/articles')
    },
    async logout() {
      await this.$store.dispatch('login/logout')
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
      minLength: minLength(6)
    }
  }
}
</script>
