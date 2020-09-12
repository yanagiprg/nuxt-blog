<template>
  <EditComment :props-comment-text="commentText" />
</template>

<script>
import EditComment from '~/components/comments/EditComment'

export default {
  components: {
    EditComment
  },

  async asyncData({ store, params }) {
    const commentData = await store.dispatch('editComment', params.id)
    return {
      commentText: commentData.commentText
    }
  }
}
</script>
