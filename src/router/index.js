import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import RoomQ from '@/components/RoomQ.vue'
import TopOfQueue from '@/components/TopOfQueue.vue'
import SearchResults from '@/components/SearchResults.vue'
import QueueList from '@/components/QueueList.vue'
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
  }
  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('home')
  else next()
})

export default router
