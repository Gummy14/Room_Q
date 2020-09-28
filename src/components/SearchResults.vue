<template>
  <div>
    <v-card class="ma-1" raised hover v-for="song in searchResults" :key="song.id" @click="addSongToQueue(song)">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ song.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ song.artists[0].name }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-avatar tile class="ma-3" size="80">
            <v-img :src="song.album.images[0].url"></v-img>
          </v-list-item-avatar>
      </v-list-item>
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
        artist: song.artists[0].name,
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