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
        <v-btn @click="signIn">Login</v-btn>
        <router-link to="/sign-up">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'login',
  data: () => ({
    email: '',
    password: ''
  }),
  methods: {
    signIn () {
      var self = this
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        function () {
          var currentUser = firebase.auth().currentUser
          
          var user = {
            username: currentUser.displayName,
            userId: currentUser.uid
          }
          self.$store.commit('setUser', {
            User: user
          })
            
          alert('Success!')
          self.$router.replace('/room-select')
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
