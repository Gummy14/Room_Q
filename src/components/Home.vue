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
       <queue-list></queue-list>
      <v-dialog v-model="isSearching">
        <search-results @finishedSearching="isSearching=false"></search-results>
      </v-dialog>
    </v-content>
  </div>
</template>

<script>
import firebase from 'firebase'
import GetSearchResults from './GetSearchResults'
import QueueList from './QueueList'
import SearchResults from './SearchResults'
import { mdiExitToApp } from '@mdi/js'
import { mdiMagnify } from '@mdi/js'
import { db } from '../../firebaseConfig'
import { mapState } from 'vuex'
export default {
  name: 'home',
  components: {
    QueueList,
    SearchResults
  },
  data () {
    return {
      hideTitle: false,
      drawer: false,
      signOutIcon: mdiExitToApp,
      searchIcon: mdiMagnify,
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
          searchQuery: this.query,
          accessToken: this.token.access_token
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
        db.collection('queues').doc(self.roomCode).get().then((doc) => {
          var crowd = doc.data().crowd.filter(x => x.userId !== userToRemove.userId)
          db.collection('queues').doc(self.roomCode).update({ crowd: crowd })
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
    }
  },
  mounted () {
    var self = this
    db.collection('queues').doc(this.roomCode).onSnapshot(function (doc) {
      self.$store.commit('setQueue', {
        Queue: doc.data().queue
      })
      self.$store.commit('setCrowd', {
        Crowd: doc.data().crowd
      })
      self.$store.commit('setToken', {
        Token: doc.data().token
      })
      self.$store.commit('setPlaylist', {
        Playlist: doc.data().playlist
      })
    })
  },
  computed: {
    ...mapState({ user: 'user', crowd: 'crowd', token: 'token', roomCode: 'roomCode'}),
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
