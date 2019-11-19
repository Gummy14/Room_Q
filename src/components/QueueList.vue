<template>
  <div>
    <v-list v-if="queue && queue.length > 0" two-line>
      <template v-for="(video, index) in queue">
      <v-list-item ripple :key="video.videoId">
        <v-list-item-content>
          <v-list-item-title>{{ video.title }}</v-list-item-title>
          <v-list-item-subtitle>QUEUED BY: {{ video.queuedBy }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="index + 1 < queue.length" :key="index"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'queue-list',
  props: [
    'queue'
  ],
}
</script>
<style scoped>

</style>