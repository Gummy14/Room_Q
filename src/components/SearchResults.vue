<template>
  <div>
    <v-card raised hover v-for="song in searchResults" :key="song.id" @click="addSongToQueue(song)">
      <span>
        <img :src="song.album.images[0].url" width="33%" height="100%">
        <div>
          <h3>{{ song.name }}</h3>
        </div>
      </span>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../../firebaseConfig'
export default {
  name: 'search-results',
  computed: {
    ...mapState({ searchResults: 'searchResults', user: 'user'})
  },
  methods: {
    addSongToQueue (song) {
      var newQueueObject = {
        songId: song.id,
        title: song.name,
        thumbnail: song.album.images[0].url,
        queuedBy: this.user.username,
        votesToSkip: [],
        votesUp: []
      }
      
      var newQueue = JSON.parse ( JSON.stringify ( this.$store.getters.getQueue) )
      newQueue.push(newQueueObject)

      db.collection('queues').doc('room').update({ queue: newQueue })
      
      this.$store.commit('setSearchResults', {
        SearchResults: []
      })
      this.$emit('finishedSearching')
    }
  }
}
</script>
<style scoped>
</style>