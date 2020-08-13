<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <nuxt-link to="/articles" class="text-link">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </nuxt-link>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="teal" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Nuxt Blog</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isLogin" to="/login" nuxt small outlined color="white"
        >Login</v-btn
      >
      <v-btn v-else nuxt small outlined color="white" @click="logout"
        >Logout</v-btn
      >
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer color="teal" app>
      <a
        class="white--text"
        href="https://github.com/yanagiprg/nuxt-blog/"
        target="_blank"
        >&copy; source</a
      >
    </v-footer>
  </v-app>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data: () => ({
    drawer: null,
    isLogin: false,
    email: ''
  }),

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid
        this.isLogin = true
        this.user = user
        this.$store.commit('getUser', user)
      } else {
        this.isLogin = false
        this.user = []
      }
    })
  },

  methods: {
    logout() {
      this.$store.dispatch('login/logout')
    }
  }
}
</script>
