<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" md="4" required>
        <v-text-field
          v-model="$v.title.$model"
          :counter="8"
          label="Title"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="text" label="Text"></v-text-field>
      </v-col>
    </v-row>
    <v-btn
      class="mr-4"
      small
      outlined
      :disabled="$v.$invalid"
      @click="addArticle()"
      >submit</v-btn
    >
    <v-btn small outlined @click="resetForm()">reset</v-btn>
  </v-form>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import { validateTitle } from '~/utils/validations'

export default {
  data() {
    return {
      title: '',
      text: ''
    }
  },

  computed: {
    titleErrors() {
      return validateTitle(this.$v.title)
    }
  },

  methods: {
    addArticle() {
      this.$store.dispatch('addArticle', { title: this.title, text: this.text })
      this.resetForm()
    },
    resetForm() {
      this.$refs.form.reset()
    }
  },

  validations: {
    title: {
      required,
      maxLength: maxLength(8)
    }
  }
}
</script>
