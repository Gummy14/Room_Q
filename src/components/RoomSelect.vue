<template>
  <div>
    <v-text-field
      rounded
      label="Enter a room code"
      solo-inverted
      class="room-code"
      v-model="roomCode">
    </v-text-field>
    <v-btn 
      class="enter"
      @click="EnterRoom">Go!
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../../firebaseConfig'
export default {
  name: 'room-select',
  data () {
    return {
      roomCode: undefined
    }
  },
  methods: {
    EnterRoom () {
      var self = this
      var crowd
      this.$store.commit('setRoomCode', {
        RoomCode: this.roomCode
      })
      db.collection('queues').doc(this.roomCode).get().then((doc) => {
        crowd = doc.data().crowd
        crowd.push(self.user.userId)
        self.$store.commit('setCrowd', {
          Crowd: crowd
        })
        db.collection('queues').doc(self.roomCode).update({ crowd: crowd })
            
        alert('Success!')
        self.$router.replace('/home')
      })
      
    }
  },
  computed: {
    ...mapState({ user: 'user', crowd: 'crowd'}),
  }
}
</script>
<style scoped>
.room-code {
  margin-top: 10%;
  margin-left: 10%;
  margin-right: 10%;
}
.enter {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
