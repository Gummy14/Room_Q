<template>
  <div>
    <v-expansion-panels
      accordion
      v-if="queue && queue.length > 0" two-line>
      <template v-for="(video, index) in queue">
      <v-expansion-panel class="panel" ripple :key="video.videoId">
        <v-expansion-panel-header>{{ video.title }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <h4>QUEUED BY: {{ video.queuedBy }}</h4>
          <v-btn :disabled="didVoteToSkip(index)" @click="voteSkip(index)" rounded>Vote Skip {{ totalVotesToSkip(index) }}</v-btn>
          <v-btn v-if="showUpVoteButton(index)" :disabled="didVoteUp(index)" @click="voteUp(index)" class="vote-up" rounded>Vote Up</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-divider v-if="index + 1 < queue.length" :key="index"></v-divider>
      </template>
    </v-expansion-panels>
  </div>
</template>

<script>
import { db } from '../../firebaseConfig'
import { mapState } from 'vuex'
export default {
  name: 'queue-list',
  props: [
    'queue'
  ],
  methods: {
    voteSkip (index) {
      if (this.playMode) index++
      this.fullQueue[index].votesToSkip.push(this.user.userId)
      if (this.fullQueue[index].votesToSkip.length === Math.ceil(this.crowd.length / 2)) {
        this.removefromQueue(this.fullQueue[index].videoId)
      } else {
        this.$store.commit('setQueue', {
          Queue: this.fullQueue
        })

       db.collection('queues').doc('room').update({ queue: this.fullQueue })
      }
    },
    didVoteToSkip(index) {
      if (this.playMode) index++
      var votesToSkip = this.fullQueue[index].votesToSkip.filter(x => x === this.user.userId)
      if(votesToSkip.length > 0) {
        return true
      } else {
        return false
      }
    },
    totalVotesToSkip (index) {
      if (this.playMode) index++
      if (this.fullQueue[index].votesToSkip.length === 0) {
        return ''
      } else {
        var currentVotes = this.fullQueue[index].votesToSkip.length
        var votesNeededToSkip = Math.ceil(this.crowd.length / 2)
        return currentVotes + '/' + votesNeededToSkip
      }
    },
    removefromQueue (videoId) {
      var removeIndex = this.fullQueue.findIndex(x => x.videoId === videoId)
      this.fullQueue.splice(removeIndex, 1)
      this.$store.commit('setQueue', {
        Queue: this.fullQueue
      })

     db.collection('queues').doc('room').update({ queue: this.fullQueue })
    },
    showUpVoteButton(index) {
      if (this.playMode) index++
      return index > 1
    },
    voteUp(index) {
      if (this.playMode) index++
      this.fullQueue[index].votesUp.push(this.user.userId)
      var entryToMoveUp = this.fullQueue[index]
      var entryAbove = this.fullQueue[index - 1]
      this.fullQueue[index] = entryAbove
      this.fullQueue[index - 1] = entryToMoveUp

      this.$store.commit('setQueue', {
        Queue: this.fullQueue
      })

     db.collection('queues').doc('room').update({ queue: this.fullQueue })
    },
    didVoteUp(index) {
      if (this.playMode) index++
      var votesToSkip = this.fullQueue[index].votesUp.filter(x => x === this.user.userId)
      if(votesToSkip.length > 0) {
        return true
      } else {
        return false
      }
    }
  },
  computed: {
    ...mapState({ user: 'user', crowd: 'crowd', fullQueue: 'queue', playMode: 'playMode'})
  }
}
</script>
<style scoped>
.vote-up {
  float: right;
}
</style>