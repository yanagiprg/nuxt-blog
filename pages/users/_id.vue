<template>
  <EditUser
    :props-name="name"
    :props-email="email"
    :props-admin-id="admin_id"
  />
</template>

<script>
import EditUser from '~/components/users/EditUser'

export default {
  components: {
    EditUser
  },

  async asyncData({ store, params }) {
    const userData = await store.dispatch('login/editUser', params.id)
    return {
      name: userData.name,
      email: userData.email,
      admin_id: userData.admin_id
    }
  }
}
</script>
