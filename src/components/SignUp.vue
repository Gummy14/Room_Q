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

          currentUser.updateProfile({
            displayName: self.username,
          }).then(function() {

            var user = {
              username: self.username
            }
            self.$store.commit('setUser', {
              User: user
            })

            alert('Success!')
            self.$router.replace('/home')
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
