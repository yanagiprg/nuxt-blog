<template>
  <v-app>
    <TheHeader />
    <v-content>
      <nuxt />
    </v-content>
    <TheFooter />
  </v-app>
</template>

<script>
import TheHeader from '~/components/common/TheHeader'
import TheFooter from '~/components/common/TheFooter'

export default {
  components: {
    TheHeader,
    TheFooter
  }
}
</script>
