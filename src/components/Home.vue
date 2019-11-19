<template>
  <div>
    <v-toolbar>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <span v-show="!hideTitle" class="roomQ">
        <v-toolbar-title class="headline text-uppercase">
          <span>ROOM</span>
          <span class="font-weight-light">Q</span>
        </v-toolbar-title>
      </span>

      <v-text-field
        hide-details
        rounded
        dense
        solo-inverted
        :append-icon="searchIcon"
        v-model="query"
        class="query-field"
        placeholder="Search"
        @focus="isFocused()"
        @blur="isBlurred()"
        @keypress.native.enter="search()"
      >
      </v-text-field>
    </v-toolbar>

    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      >
      <v-list>
        <v-list-item>
          <div>
            <h2>Hi {{ user.username }}</h2>
            <h5>There are X people in the room</h5>
          </div>
        </v-list-item>
        <v-subheader>Options</v-subheader>
        <v-list-item>
          <div>
            <h2>Play Mode</h2>
            <h5>Setting this option will play queued songs from your device</h5>
          </div>
          <v-switch v-model="playMode" :label="`${playMode === true ? 'On' : 'Off'}`"></v-switch>
        </v-list-item>
        <v-list-item>
          <div>
            <h2>Leave Room</h2>
            <h5>Leave this room and return to the room search screen</h5>
          </div>
          <v-btn text>
            <v-icon>{{ signOutIcon }}</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <RoomQ></RoomQ>
      <v-dialog v-model="isSearching">
        <search-results @finishedSearching="isSearching=false"></search-results>
      </v-dialog>
    </v-content>
  </div>
</template>

<script>
import GetSearchResults from './GetSearchResults'
import RoomQ from './RoomQ'
import SearchResults from './SearchResults'
import { mdiExitToApp } from '@mdi/js'
import { mdiMagnify } from '@mdi/js'
import { db } from '../../firebaseConfig'
import { mapState } from 'vuex'
export default {
  name: 'home',
  components: {
    RoomQ,
    SearchResults
  },
  data () {
    return {
      hideTitle: false,
      drawer: false,
      signOutIcon: mdiExitToApp,
      searchIcon: mdiMagnify,
      playMode: false,
      query: '',
      isSearching: false,
    }
  },
  methods: {
    isFocused () {
      this.hideTitle = true
    },
    isBlurred () {
      this.hideTitle = false
    },
    search () {
      this.isSearching = true
      if (this.query !== '') {
        GetSearchResults({
          apiKey: this.$store.getters.getApiKey,
          searchQuery: this.query
        }, response => {
          this.$store.commit('setSearchResults', {
            SearchResults: response
          })
          this.query = ''
        })
      }
    }
  },
  watch: {
    isSearching (val) {
      if (!val) {
        this.$store.commit('setSearchResults', {
          SearchResults: []
        })
      }
    },
    playMode (val) {
      this.$store.commit('setPlayMode', {
        PlayMode: val
      })
    }
  },
  mounted () {
    var self = this

    db.collection('queues').doc('room').onSnapshot(function (doc) {
      self.$store.commit('setQueue', {
        Queue: doc.data().queue
      })
    })
  },
  computed: {
    ...mapState({ user: 'user'})
  }
}
</script>
<style scoped>
.query-field {
  padding-left: 1%;
}
</style>
