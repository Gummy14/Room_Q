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
          label="Username"
          v-model="username"
        >
        </v-text-field>
        <v-text-field 
          solo-inverted
          label="Email"
          v-model="email"
        >
        </v-text-field>
        <v-text-field 
          solo-inverted
          label="Password"
          type="password"
          v-model="password"
        >
        </v-text-field>
        <v-btn @click="signUp">Sign Up</v-btn>
        <router-link to="/">Back</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '../../firebaseConfig'
export default {
  name: 'sign-up',
  data: () => ({
    email: '',
    password: '',
    username: ''
  }),
  methods: {
    signUp () {
      var self = this
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        function () {
          var currentUser = firebase.auth().currentUser
          var crowd

          currentUser.updateProfile({
            displayName: self.username,
          }).then(function() {

            var user = {
              username: self.username,
              userId: currentUser.uid
            }
            self.$store.commit('setUser', {
              User: user
            })

            db.collection('queues').doc('room').get().then((doc) => {
              crowd = doc.data().crowd
              crowd.push(user.userId)
              self.$store.commit('setCrowd', {
                Crowd: crowd
              })
              db.collection('queues').doc('room').update({ crowd: crowd })

              alert('Success!')
              self.$router.replace('/home')
            })
          }).catch(function(error) {
            alert('Fail!' + error.message)
          })
        },
        function (error) {
          alert('Fail!' + error.message)
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
