let axios = require('axios')
let BASE_URL = 'https://api.spotify.com/v1/search'

export default function (options, callback) {
  // if(!options.apiKey) {
  //   throw new Error('Spotify API Key Required')
  // }  
  axios.get(BASE_URL, {
    headers: {
      Authorization: 'Bearer ',
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