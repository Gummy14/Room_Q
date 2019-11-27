import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import SignUp from '@/components/SignUp.vue'
import Home from '@/components/Home.vue'
import RoomQ from '@/components/RoomQ.vue'
import TopOfQueue from '@/components/TopOfQueue.vue'
import SearchResults from '@/components/SearchResults.vue'
import QueueList from '@/components/QueueList.vue'
import RoomSelect from '@/components/RoomSelect.vue'
import firebase from 'firebase'
import store from '../store/index.js';

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUp
  },
  {
    path: '/room-select',
    name: 'room-select',
    component: RoomSelect,
    meta: {
      requiresAuth: true
    } 
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/roomq',
    name: 'roomq',
    component: RoomQ
  },
  {
    path: '/top-of-queue',
    name: 'top-of-queue',
    component: TopOfQueue
  },
  {
    path: '/search-results',
    name: 'search-results',
    component: SearchResults
  },
  {
    path: '/queue-list',
    name: 'queue-list',
    component: QueueList
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if(currentUser) {
    var user = {
      username: currentUser.displayName,
      userId: currentUser.uid
    }
    store.commit('setUser', {
      User: user
    })
    var roomCode = store.getters.getRoomCode
    console.log(roomCode)
    
  }
  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('room-select')
  else next()
})

export default router
