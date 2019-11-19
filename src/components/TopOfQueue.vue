<template>
  <div v-if="topOfQueue">
    <div class="embeddedVideo">
      <youtube
        width="100%"
        :height="videoHeight"
        :video-id="topOfQueue.videoId" 
        :player-vars="{ autoplay: 1 }"
        @ended="removeFromTopOfQueue"/>
    </div>
    <h3>QUEUED BY: {{ topOfQueue.queuedBy }}</h3>
  </div>
</template>

<script>
import { db } from '../../firebaseConfig'
export default {
  name: 'top-of-queue',
  props: [
    'topOfQueue'
  ],
  methods: {
    removeFromTopOfQueue () {
      var queue = this.$store.getters.getQueue
      queue.shift()
      this.$store.commit('setQueue', {
        Queue: queue
      })
      db.collection('queues').doc('room').update({queue: queue})
    }
  },
  computed: {
    videoHeight () {
      return window.innerWidth*.5625
    }
  }
}
</script>

<style scoped>
.embeddedVideo {
  padding: 0px;
}
</style>