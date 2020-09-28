let axios = require('axios')
let BASE_URL = '	https://api.spotify.com/v1/playlists/2f9D8ZTMwZ9wU3QPALesD9/tracks'

export default function (options) {
  axios({ 
    method: 'POST', 
    url: BASE_URL, 
    headers: {
      Authorization: 'Bearer BQCleNR2ZNdC6otxgkRLGVafNmdQ72ViaNCi9YSrRiaeBeDWL4tG3-xurf2rMqy2tDebzkCc1gRSL6Qt4Fw-MKvRtbIoBsVFbamGhmYykuq2fbSimzIRYSVWJT1JI0VoFhorF2PUb4Gmt5q1K_Q71IlytjGJpLJAm62VVSI6UcCWLF5YbI7DPaMun_ITpUQKE53GIk9jGZjB',
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