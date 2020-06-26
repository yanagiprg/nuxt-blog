<!--
<template>
  <v-app>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="4" required>
            <v-text-field v-model="title" label="Title"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="text" label="Text"></v-text-field>
          </v-col>
        </v-row>
        <v-btn class="mr-4" small outlined @click="addArticle">submit</v-btn>
        <v-btn small outlined @click="resetForm">reset</v-btn>
      </v-container>
    </v-form>
    <Articles />
  </v-app>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters } from 'vuex'
import Articles from '~/components/Articles.vue'

export default {
  components: {
    Articles
  },

  data() {
    return {
      title: '',
      text: ''
    }
  },

  created() {
    this.$store.dispatch('getArticles')
  },

  methods: {
    addArticle() {
      this.$store.dispatch('addArticle', {
        title: this.title,
        text: this.text
      })
      this.resetForm()
    },

    resetForm() {
      this.title = ''
      this.text = ''
    }
  }
}
</script>
-->
