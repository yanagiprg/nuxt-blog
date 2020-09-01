<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="(user, index) in users" :key="index" cols="4" md="3" xl="2">
        <v-card class="article-card mx-auto teal" max-height="300px">
          <v-card-title class="pb-0 pt-1">{{ user.name }}</v-card-title>
          <v-card-text>{{ user.email }}</v-card-text>
          <v-btn outlined @click="showUser(index)">詳細</v-btn>
          <v-btn outlined @click="deleteUser(index)">削除</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      name: '',
      email: ''
    }
  },

  computed: {
    ...mapGetters({
      users: 'login/users'
    })
  },

  methods: {
    deleteUser(index) {
      this.$store.dispatch('login/deleteUser', this.users[index].id)
    },
    showUser(index) {
      this.$store.dispatch('login/showUsers', this.users[index].id)
      this.$router.push(`/users/${this.users[index].id}`)
    }
  }
}
</script>
