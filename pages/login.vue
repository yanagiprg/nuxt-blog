<template>
  <div id="app">
    <v-app>
      <v-app>
        <v-content>
          <v-container v-if="isWaiting" class="fill-height" fluid>
            <p>読み込み中</p>
          </v-container>
          <v-container v-else>
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
                          <v-text-field
                            v-model="email"
                            type="text"
                            placeholder="email"
                            prepend-icon="mdi-email"
                          ></v-text-field>

                          <v-text-field
                            v-model="password"
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
                          <v-btn color="teal" @click="passwordLogin">
                            {{ register ? '新規登録' : 'ログイン' }}
                          </v-btn>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-container>
            <v-container v-else>
              <p>{{ user.email }}でログイン中</p>
              <v-btn color="teal" @click="logOut">ログアウト</v-btn>
            </v-container>
          </v-container>
        </v-content>
      </v-app>
    </v-app>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  asyncData() {
    return {
      register: false,
      isWaiting: true,
      isLogin: false,
      user: [],
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.isWaiting = false
      this.errorMessage = ''
      if (user) {
        this.isLogin = true
        this.user = user
      } else {
        this.isLogin = false
        this.user = []
      }
    })
  },
  methods: {
    passwordLogin() {
      const email = this.email
      const password = this.password
      if (this.register) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .catch(
            function(error) {
              const errorMessage = error.message
              this.errorMessage = errorMessage
            }.bind(this)
          )
      } else {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .catch(
            function(error) {
              const errorMessage = error.message
              this.errorMessage = errorMessage
            }.bind(this)
          )
      }
    },
    logOut() {
      firebase.auth().signOut()
    }
  }
}
</script>
