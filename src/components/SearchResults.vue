<template>
  <div>
    <v-card raised hover v-for="video in searchResults" :key="video.id.videoId" @click="addVideoToQueue(video)">
      <span>
        <img :src="video.snippet.thumbnails.high.url" width="33%" height="100%">
        <div>
          <h3>{{ video.snippet.title }}</h3>
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
    ...mapState({ searchResults: 'searchResults', user: 'user' })
  },
  methods: {
    addVideoToQueue (video) {
      var queue = this.$store.getters.getQueue
      var newQueueObject = {
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        queuedBy: this.user.username,
        votesToSkip: [],
        votesUp: []
      }
      queue.push(newQueueObject)
      this.$store.commit('setQueue', {
        Queue: queue
      })

      db.collection('queues').doc('room').update({ queue: queue })
      
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