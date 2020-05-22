<template>
  <section class="container">
    <div v-if="isWaiting">
      <p>読み込み中</p>
    </div>
    <div v-else>
      <div v-if="!isLogin">
        <div>
          <p>
            <input v-model="email" type="text" placeholder="email" />
          </p>
          <p>
            <input v-model="password" type="password" placeholder="password" />
          </p>
          <p>
            <input id="checkbox" v-model="register" type="checkbox" />
            <label for="checkbox">新規登録</label>
          </p>
          <button @click="passwordLogin">
            {{ register ? '新規登録' : 'ログイン' }}
          </button>
          <p>{{ errorMessage }}</p>
        </div>
      </div>
      <div v-else>
        <p>{{ user.email }}でログイン中</p>
        <button @click="logOut">ログアウト</button>
      </div>
    </div>
  </section>
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
