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
            <h2 class="username">{{ user.username }}</h2>
            <h5>{{ crowdSize}}</h5>
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
            <v-icon @click="signOut">{{ signOutIcon }}</v-icon>
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
import firebase from 'firebase'
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
    },
    signOut () {
      var self = this
      var userToRemove = this.user
      firebase.auth().signOut().then(function() {
        db.collection('queues').doc('room').get().then((doc) => {
          var crowd = doc.data().crowd.filter(x => x !== userToRemove.userId)
          db.collection('queues').doc('room').update({ crowd: crowd })
        })
        self.$store.commit('clearStore')
        alert('Successfully Logged Out!')
        self.$router.replace('/')
      }).catch(function(error) {
        alert('Fail!' + error.message)
      })
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
      self.$store.commit('setCrowd', {
        Crowd: doc.data().crowd
      })
    })
  },
  computed: {
    ...mapState({ user: 'user', crowd: 'crowd'}),
    crowdSize () {
      if (this.crowd.length === 1) {
        return 'There is ' + this.crowd.length + ' person in the room'
      } else {
        return 'There are ' + this.crowd.length + ' people in the room'
      }
    }
  }
}
</script>
<style scoped>
.query-field {
  padding-left: 1%;
}
.username {
  text-transform:capitalize;
}
</style>
