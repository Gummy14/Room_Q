let axios = require('axios')
let BASE_URL = 'https://api.spotify.com/v1/me'

export default function (options, callback) {
  axios({ 
    method: 'GET', 
    url: BASE_URL,
    headers: {
      "Authorization": "Bearer " + options.accessToken,
    }
  })
  .then(response => {
    if(callback) {
      callback(response)
    }
  })
  .catch(error => {
    console.log('GetSpotifyUserInfo Failed: ' + error)
  })
}