import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiKey: 'AIzaSyDrSeaXt35dKhxP1ni3ICIFAf_FaqVkHxU',
    apiKeyList: [
      'AIzaSyDrSeaXt35dKhxP1ni3ICIFAf_FaqVkHxU',
      'AIzaSyDYgRSUwq9UVLz4fhWCfTdKgNJEcZjNAdQ',
      'AIzaSyD0pTKL9yLJ622YXFatnHqh_6JtNzd4ID8'
    ],
    searchResults: [],
    apiKeyPosition: 0,
    playMode: false,
    queue: [],
    user: undefined,
    crowd: []
  },
  mutations: {
    setPlayMode (state, payload) {
      state.playMode = payload.PlayMode
    },
    setSearchResults (state, payload) {
      state.searchResults = payload.SearchResults
    },
    setApiKey (state, payload) {
      state.apiKey = payload.ApiKey
    },
    setApiKeyPosition (state, payload) {
      state.apiKeyPosition = payload.ApiKeyPosition
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
    clearStore (state) {
      state.searchResults = [],
      state.apiKeyPosition = 0,
      state.playMode = false,
      state.queue = [],
      state.user = undefined,
      state.crowd = []
    }
  },
  actions: {
  },
  getters: {
    getplayMode (state) {
      return state.playMode
    },
    getSearchResults (state) {
      return state.searchResults
    },
    getApiKey (state) {
      return state.apiKey
    },
    getApiKeyList (state) {
      return state.apiKeyList
    },
    getApiKeyPosition (state) {
      return state.apiKeyPosition
    },
    getQueue (state) {
      return state.queue
    },
    getUser (state) {
      return state.user
    },
    getCrowd (state) {
      return state.crowd
    }
  }
})
