<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="4" required>
          <v-text-field label="Title"></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field label="Text"></v-text-field>
        </v-col>
      </v-row>
      <v-btn class="mr-4" small outlined @click="submit">submit</v-btn>
      <v-btn small outlined @click="reset">reset</v-btn>
    </v-container>
    <nuxt-link to="/articles" class="text-link">戻る</nuxt-link>
  </v-form>
</template>
