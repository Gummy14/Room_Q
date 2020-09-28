let axios = require('axios')
let BASE_URL = 'https://api.spotify.com/v1/search'

export default function (options, callback) {
  // if(!options.apiKey) {
  //   throw new Error('Spotify API Key Required')
  // }  
  axios.get(BASE_URL, {
    headers: {
      Authorization: 'Bearer BQBk05r7_N1csmOX77uS3SJyX0wVvX8o_KrI22f6ejF8qg59sWAkgAH6Uu_leGPXkhJ5vIWjJrDqxeZCOMZ19Ep1gPQ9tTpJofEiu_C7PccpRnnHb44b0CiUKf6TF7JHMsOaFYqJJIXMZkEiJD5AhdYXFg00YLwdO4-cTV4Yv4Kmk77jtqAwwJITiqctMmecKo-OZIwZ9B2D',
    },
    params: {
      q: options.searchQuery,
      type: 'track',
      market: 'US',
      limit: 25,
    } 
  })
  .then(response => {
    if(callback) {
      callback(response.data.tracks.items)
    }
  })
  .catch(error => {
    console.log('Failed: ' + error)
  })
}