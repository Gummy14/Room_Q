let axios = require('axios')
let BASE_URL = 'https://accounts.spotify.com/api/token'

export default function (options, callback) {
  const bodyData = new URLSearchParams();
  bodyData.append("client_id", "b5a34f7fd495450db3ba31825bc8471c");
  bodyData.append("grant_type", "authorization_code");
  bodyData.append("code", options.code);
  bodyData.append("redirect_uri", options.redirect);
  bodyData.append("code_verifier", options.codeVerifier);
  axios({ 
    method: 'POST', 
    url: BASE_URL,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",    
    },
    data: bodyData
  })
  .then(response => {
    if(callback) {
      callback(response.data)
    }
  })
  .catch(error => {
    console.log('SpotifyAccessToken Failed: ' + error)
  })
}