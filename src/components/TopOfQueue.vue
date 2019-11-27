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
    <v-btn :disabled="didVoteToSkip()" @click="voteSkip()" rounded>Vote Skip {{ totalVotesToSkip() }}</v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../../firebaseConfig'
export default {
  name: 'top-of-queue',
  props: [
    'topOfQueue'
  ],
  methods: {
    voteSkip () {
      this.topOfQueue.votesToSkip.push(this.user.userId)
      if (this.topOfQueue.votesToSkip.length === Math.ceil(this.crowd.length / 2)) {
        this.removeFromTopOfQueue()
      } else {
        var queue = this.$store.getters.getQueue
        queue[0].votesToSkip = this.topOfQueue.votesToSkip
        this.$store.commit('setQueue', {
          Queue: queue
        })
        db.collection('queues').doc('room').update({queue: queue})
      }
    },
    removeFromTopOfQueue () {
      var queue = this.$store.getters.getQueue
      queue.shift()
      this.$store.commit('setQueue', {
        Queue: queue
      })
      db.collection('queues').doc('room').update({queue: queue})
    },
    didVoteToSkip() {
      var votesToSkip = this.topOfQueue.votesToSkip.filter(x => x === this.user.userId)
      if(votesToSkip.length > 0) {
        return true
      } else {
        return false
      }
    },
    totalVotesToSkip () {
      if (this.topOfQueue.votesToSkip.length === 0) {
        return ''
      } else {
        var currentVotes = this.topOfQueue.votesToSkip.length
        var votesNeededToSkip = Math.ceil(this.crowd.length / 2)
        return currentVotes + '/' + votesNeededToSkip
      }
    }
  },
  computed: {
    ...mapState({ user: 'user', crowd: 'crowd' }),
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