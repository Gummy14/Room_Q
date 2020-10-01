let axios = require('axios')
let BASE_URL = '	https://api.spotify.com/v1/playlists/2f9D8ZTMwZ9wU3QPALesD9/tracks'

export default function (options) {
  axios({ 
    method: 'POST', 
    url: BASE_URL, 
    headers: {
      Authorization: 'Bearer ',
      "Content-Type": "application/json",    
    },
    params: {
      playlist_id: '2f9D8ZTMwZ9wU3QPALesD9', 
      uris: 'spotify:track:' + options.songToAdd.songId
    }
  })
  .catch(error => {
    console.log('Failed: ' + error)
  })
}