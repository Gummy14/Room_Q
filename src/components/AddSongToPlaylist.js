let axios = require('axios')


export default function (options) {
  var BASE_URL = 'https://api.spotify.com/v1/playlists/'+ options.playlist + '/tracks'
  axios({ 
    method: 'POST', 
    url: BASE_URL, 
    headers: {
      Authorization: 'Bearer ' + options.accessToken,
      "Content-Type": "application/json",    
    },
    params: {
      playlist_id: options.playlist, 
      uris: 'spotify:track:' + options.songToAdd.songId
    }
  })
  .catch(error => {
    console.log('Failed: ' + error)
  })
}