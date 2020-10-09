let axios = require('axios')

export default function (options, callback) {
  var BASE_URL = 'https://api.spotify.com/v1/users/' + options.spotifyUserId + '/playlists'
  axios({ 
    method: 'POST', 
    url: BASE_URL,
    headers: {
      "Authorization": "Bearer " + options.accessToken,
      "Content-Type": "application/json"
    },
    params: {
        user_id: options.spotifyUserId
    },
    data: {
        name: "RoomQ",
        description: "A RoomQ playlist",
        public: false
    }
  })
  .then(response => {
    if(callback) {
      callback(response.data)
    }
  })
  .catch(error => {
    console.log('CreatePlaylist Failed: ' + error)
  })
}