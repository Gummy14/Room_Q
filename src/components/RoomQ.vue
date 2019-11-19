<template>
  <div>
    <div v-if="playMode">
      <div>
        <top-of-queue :topOfQueue="topOfQueue"></top-of-queue>
      </div>
      <div>
        <h2 v-if="queueWithoutTop.length > 0">Up Next...</h2>
        <queue-list :queue="queueWithoutTop"></queue-list>
      </div>
    </div>

    <div v-else-if="!playMode">
      <div>
        <h2 v-if="queue.length > 0">Now Queued</h2>
        <queue-list :queue="queue"></queue-list>
      </div>
    </div>
  </div>
</template>

<script>
import TopOfQueue from './TopOfQueue'
import QueueList from './QueueList'
import { mapState } from 'vuex'
export default {
  name: 'roomq',
  components: {
    TopOfQueue,
    QueueList
  },
  computed: {
    ...mapState({ queue: 'queue', playMode: 'playMode' }),
    topOfQueue () {
      if (this.queue.length > 0) {
        return this.queue[0]
      } else {
        return ''
      }
    },
    queueWithoutTop () {
      var queueWithoutTop = this.queue
      return queueWithoutTop.slice(1)
    }
  }
}
</script>
<style scoped>
</style>