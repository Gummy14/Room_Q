import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiKey: 'AIzaSyC-vYRiv_9Z21W7XJetZ1TUadKZRyhB294',
    searchResults: [],
    queue: [],
    user: null,
    crowd: [],
    token: null,
    playlist: '',
    roomCode: ''
  },
  mutations: {
    setSearchResults (state, payload) {
      state.searchResults = payload.SearchResults
    },
    setQueue (state, payload) {
      state.queue = payload.Queue
    },
    setUser (state, payload) {
      state.user = payload.User
    },
    setCrowd (state, payload) {
      state.crowd = payload.Crowd
    },
    setToken (state, payload) {
      state.token = payload.Token
    },
    setPlaylist (state, payload) {
      state.playlist = payload.Playlist
    },
    setRoomCode (state, payload) {
      state.roomCode = payload.RoomCode
    },
    clearStore (state) {
      state.searchResults = [],
      state.apiKeyPosition = 0,
      state.queue = [],
      state.user = null,
      state.crowd = [],
      state.playlist = ''
    }
  },
  actions: {
  },
  getters: {
    getSearchResults (state) {
      return state.searchResults
    },
    getApiKey (state) {
      return state.apiKey
    },
    getQueue (state) {
      return state.queue
    },
    getUser (state) {
      return state.user
    },
    getCrowd (state) {
      return state.crowd
    },
    getToken (state) {
      return state.token
    },
    getPlaylist (state) {
      return state.playlist
    },
    getRoomCode (state) {
      return state.roomCode
    }
  }
})
