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
                  <v-text-field
                    v-model="$v.name.$model"
                    :counter="16"
                    type="text"
                    placeholder="name"
                    prepend-icon="mdi-face"
                    >{{ name }}</v-text-field
                  >
                  <v-text-field
                    v-model="$v.email.$model"
                    type="text"
                    placeholder="email"
                    prepend-icon="mdi-email"
                    >{{ email }}</v-text-field
                  >
                  <v-text-field
                    v-model="$v.password.$model"
                    type="password"
                    placeholder="password"
                    prepend-icon="mdi-lock"
                    >{{ password }}</v-text-field
                  >
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
  validatePassword
} from '~/utils/validations'

export default {
  async asyncData({ store, params }) {
    const user = await store.dispatch('login/showUser', params.id)
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      admin_id: user.admin_id
    }
  },

  data() {
    return {
      id: this.$route.params.id,
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
    updateUser(id) {
      const form = {
        mame: this.name,
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('login/updateUser', { id, form })
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
    }
  }
}
</script>
