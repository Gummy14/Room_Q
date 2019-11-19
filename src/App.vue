<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'App',
  data: () => ({
    //
  }),
  mounted () {
    var currentUser = firebase.auth().currentUser

    if (currentUser) {
      var user = {
        username: currentUser.displayName
      }

      this.$store.commit('setUser', {
        User: user
      })
      this.$router.replace('/home')
    }
    else {
      this.$router.replace('/')
    }
  }
}
</script>
