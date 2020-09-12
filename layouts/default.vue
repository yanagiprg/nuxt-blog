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
      <v-toolbar-title @click="showUser">
        {{ user ? user.displayName : null }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isLogin" to="/login" nuxt small outlined color="white"
        >Login</v-btn
      >
      <v-btn v-else nuxt small outlined color="white" @click="logout"
        >Logout</v-btn
      >
    </v-app-bar>
    <v-main>
      <v-container v-if="isLoading === true" fluid>
        <Loading />
      </v-container>
      <v-container v-else fluid>
        <nuxt />
      </v-container>
    </v-main>
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
import _ from 'lodash'
import { mapGetters } from 'vuex'
import firebase from '~/plugins/firebase'
import Loading from '~/components/Loading'

export default {
  components: {
    Loading
  },

  data() {
    return {
      drawer: null,
      email: '',
      users: [],
      isLoading: true
    }
  },

  computed: {
    ...mapGetters({
      user: 'login/user',
      isLogin: 'login/isLogin',
      adminUser: 'login/adminUser'
    })
  },

  async mounted() {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit('login/setUser', _.cloneDeep(user))
        this.$store.commit('setUser', _.cloneDeep(user))
        this.$store.commit('login/setIsLogin', true)
        this.$store.dispatch('getArticles')
        this.$store.dispatch('login/getUsers')
        this.$store.dispatch('login/getAdminUser')
        this.isLoading = false
      } else {
        this.$store.commit('setUser', null)
        this.$store.commit('login/setIsLogin', false)
        this.$store.commit('setArticles', null)
        this.$router.push('/login')
        this.isLoading = false
      }
    })
  },

  methods: {
    logout() {
      this.$store.dispatch('login/logout')
      this.$store.commit('login/setIsLogin', false)
    },

    showUser() {
      // if (this.adminUser.admin_id) {
      this.$router.push('/users')
      // } else {
      //   this.$router.push(`/users/${this.user.uid}`)
      // }
    }
  }
}
</script>
