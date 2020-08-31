<template>
  <div>
    <div>
      <div class="roomq-title">
        <span class="font-italic">ROOM</span>
        <span class="font-weight-thin font-italic">Q</span>
      </div>
      <div>
        <v-text-field 
          solo-inverted
          label="Name"
          v-model="name"
        >
        </v-text-field>
        <v-text-field 
          solo-inverted
          label="Room Code"
          v-model="roomCode"
        >
        </v-text-field>
        <v-btn @click="enterRoom">Enter</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'login',
  data: () => ({
    name: '',
    roomCode: ''
  }),
  methods: {
    enterRoom () {
        var db = firebase.firestore()
        var self = this
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
              db.collection('queues').doc('room').get().then((doc) => {
                var crowd = doc.data().crowd
                crowd.push(user)
                self.$store.commit('setCrowd', {
                  Crowd: crowd
                })
                db.collection('queues').doc('room').update({ crowd: crowd })
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
      }
  }
}
</script>
<style scoped>
.roomq-title {
  text-align: center;
  font-size: 100px;
}
</style>
