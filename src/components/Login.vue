<template>
  <div>
    <div class="roomq-title">
      <span class="font-italic">Room</span>
      <span class="font-weight-thin font-italic">Q</span>
    </div>
    <v-btn outlined class="join-room" @click="joinRoom = !joinRoom">Join Room</v-btn>
    <v-btn outlined class="create-room" @click="authViaSpotify">Create Room (Requires Spotify)</v-btn>
    <v-dialog v-model="spotifyAuth">
      <v-card class="enter-room">
        <v-card-title>Room Code: {{ $store.getters.getRoomCode }}</v-card-title>
        <v-text-field
          hide-details
          rounded
          dense
          solo-inverted
          v-model="name"
          placeholder="Name"
        >
        </v-text-field>
        <v-btn outlined class="enter-button" @click="createRoom">Go!</v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="joinRoom">
      <v-card class="enter-room">
        <v-text-field
          hide-details
          rounded
          dense
          solo-inverted
          v-model="roomCode"
          placeholder="Room Code"
        >
        </v-text-field>
        <v-text-field
          hide-details
          rounded
          dense
          solo-inverted
          v-model="name"
          placeholder="Name"
        >
        </v-text-field>
        <v-btn outlined class="enter-button" @click="enterRoom">Go!</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
import base64url from 'base64url'
import SpotifyAccessToken from './SpotifyAccessToken'
import GetSpotifyUserInfo from './GetSpotifyUserInfo'
import CreatePlaylist from './CreatePlaylist'
import { sha256 } from 'js-sha256';
export default {
  name: 'login',
  data: () => ({
    name: '',
    roomCode: '',
    spotifyAuth: false,
    token: null,
    spotifyUserId: '',
    joinRoom: false
  }),
  methods: {
    enterRoom () {
      var db = firebase.firestore()
      var self = this
      this.roomCode = this.roomCode.toUpperCase()
      firebase.auth().signInAnonymously().then(
        function () {
          var currentUser = firebase.auth().currentUser
          currentUser.updateProfile({
            displayName: self.name,
          })
          .then(function() {
            var user = {
              username: currentUser.displayName,
              userId: currentUser.uid
            }
            self.$store.commit('setUser', {
              User: user
            })
            self.$store.commit('setRoomCode', {
              RoomCode: self.roomCode
            })
            db.collection('queues').doc(self.roomCode).get().then((doc) => {
              var crowd = doc.data().crowd
              crowd.push(user)
              db.collection('queues').doc(self.roomCode).update({ crowd: crowd })
            })
            .then(() => {
              self.$router.replace('/home')
            })
          })
        },
        function (error) {
          alert('Failed to join!\n' + error.message)
        }
      )
    },
    createRoom () {
      var db = firebase.firestore()
      var self = this
      var creadtedRoomCode = this.$store.getters.getRoomCode
      firebase.auth().signInAnonymously().then(
        function () {
          var currentUser = firebase.auth().currentUser
          currentUser.updateProfile({
            displayName: self.name,
          })
          .then(function() {
            var user = {
              username: currentUser.displayName,
              userId: currentUser.uid
            }

            self.$store.commit('setUser', {
              User: user
            })
            
            var crowd = []
            crowd.push(user)

            CreatePlaylist({
              spotifyUserId: self.spotifyUserId,
              accessToken: self.token.access_token
            }, response => {
              var databaseObject = {
                crowd: crowd,
                queue: [],
                token: self.token,
                playlist: response.id,
              }
              db.collection('queues').doc(creadtedRoomCode).set(databaseObject)
              .then(function() {
                self.$router.replace('/home')
              })
            })
          })
        },
        function (error) {
          alert('Failed to join!\n' + error.message)
        }
      )
    },
    authViaSpotify () {
      var my_client_id = 'b5a34f7fd495450db3ba31825bc8471c'
      var scopes = 'playlist-modify-public playlist-modify-private'

      var codeVerifierLength = Math.floor(Math.random() * 86) + 43; //random number between 43 and 128
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-~'
      var codeVerifier = ''
      for(let i = 0; i < codeVerifierLength; i++) {
        codeVerifier += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      var sha256CodeVerifier = sha256.array(codeVerifier)
      var code_challenge = base64url(sha256CodeVerifier)
      localStorage.setItem("codeVerifier", codeVerifier)

      var url = 'https://accounts.spotify.com/authorize' +
        '?client_id=' + my_client_id +
        '&response_type=code' +
        '&redirect_uri=' + encodeURIComponent(window.location.origin + '/') +
        '&code_challenge_method=S256'+
        '&code_challenge=' + code_challenge +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '')
        
      window.location.replace(url)
    },
    generateRoomCode () {
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var generatedRoomCode = ''
      for(let i = 0; i < 4; i++) {
        generatedRoomCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return generatedRoomCode
    }
  },
  mounted () {
    if (window.location.search) {
      var self = this
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString);
      const authCode = urlParams.get('code')
      SpotifyAccessToken({
        code: authCode,
        redirect: window.location.origin + '/',
        codeVerifier: localStorage.getItem('codeVerifier')
      }, response => {
        self.token = response
        GetSpotifyUserInfo({
          accessToken: response.access_token
        }, response => {
          self.spotifyUserId = response.data.id
          self.$store.commit('setRoomCode', {
            RoomCode: self.generateRoomCode()
          })
          self.spotifyAuth = true
        })
      })
    }
  }
}
</script>
<style scoped>
.roomq-title {
  margin-top: 25%;
  text-align: center;
  font-size: 100px;
}
.join-room {
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 25%;
}
.create-room {
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 5%;
}
.enter-room {
  padding: 3%;
}
.enter-button {
  margin-top: 2%; 
  width: 100%;
}
.text-field {
  margin-bottom: 2%;
}
</style>
