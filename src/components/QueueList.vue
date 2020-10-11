<template>
  <div>
    <v-expansion-panels
      accordion
      v-if="queue && queue.length > 0" two-line>
      <template v-for="(song, index) in queue">
      <v-expansion-panel class="panel" ripple :key="song.songId">
        <v-expansion-panel-header>{{ song.title }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <h2>{{ song.artist }}</h2>
          <h5>QUEUED BY: {{ song.queuedBy }}</h5>
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
import AddSongToPlaylist from './AddSongToPlaylist'
import { mapState } from 'vuex'
export default {
  name: 'queue-list',
  computed: {
    ...mapState({ user: 'user', crowd: 'crowd', queue: 'queue', token: 'token', playlist: 'playlist', roomCode: 'roomCode'})
  },
  methods: {
    voteSkip (index) {
      this.queue[index].votesToSkip.push(this.user.userId)
      if (this.queue[index].votesToSkip.length === Math.ceil(this.crowd.length / 2)) {
        this.removefromQueue(this.queue[index].videoId)
      } else {
        this.$store.commit('setQueue', {
          Queue: this.queue
        })

       db.collection('queues').doc(this.roomCode).update({ queue: this.queue })
      }
    },
    didVoteToSkip(index) {
      var votesToSkip = this.queue[index].votesToSkip.filter(x => x === this.user.userId)
      if(votesToSkip.length > 0) {
        return true
      } else {
        return false
      }
    },
    totalVotesToSkip (index) {
      if (this.queue[index].votesToSkip.length === 0) {
        return ''
      } else {
        var currentVotes = this.queue[index].votesToSkip.length
        var votesNeededToSkip = Math.ceil(this.crowd.length / 2)
        return currentVotes + '/' + votesNeededToSkip
      }
    },
    removefromQueue (songId) {
      var removeIndex = this.queue.findIndex(x => x.songId === songId)
      this.queue.splice(removeIndex, 1)
      this.$store.commit('setQueue', {
        Queue: this.queue
      })

     db.collection('queues').doc(this.roomCode).update({ queue: this.queue })
    },
    showUpVoteButton(index) {
      return index > 1
    },
    voteUp(index) {
      this.queue[index].votesUp.push(this.user.userId)
      var entryToMoveUp = this.queue[index]
      var entryAbove = this.queue[index - 1]
      this.queue[index] = entryAbove
      this.queue[index - 1] = entryToMoveUp

      this.$store.commit('setQueue', {
        Queue: this.queue
      })

     db.collection('queues').doc(this.roomCode).update({ queue: this.queue })
    },
    didVoteUp(index) {
      var votesToSkip = this.queue[index].votesUp.filter(x => x === this.user.userId)
      if(votesToSkip.length > 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    queue (newQueue, oldQueue) {
      if (this.user && this.crowd && this.crowd.length > 0 && this.crowd[0].userId === this.user.userId && this.queue.length > 0 && newQueue.length != oldQueue.length) {
        AddSongToPlaylist({
          songToAdd: newQueue[newQueue.length - 1],
          accessToken: this.token.access_token,
          playlist: this.playlist
        })
      }
    }
  }
}
</script>
<style scoped>
.vote-up {
  float: right;
}
</style>