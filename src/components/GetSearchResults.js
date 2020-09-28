let axios = require('axios')
let BASE_URL = 'https://api.spotify.com/v1/search'

export default function (options, callback) {
  // if(!options.apiKey) {
  //   throw new Error('Spotify API Key Required')
  // }  
  axios.get(BASE_URL, {
    headers: {
      Authorization: 'Bearer BQDd6DPyDBOhN1BvXsmGHElR7AjF0QLppg2uu8VSWS-TW_vivVYrPYlG5CmsPnDVBdi_W77ZXV3JnOWO3pLFMzubHpPtjeMDS3aMMrHfFYcqPwzNDwb3_QM5Zn74JzvPH3fkdZ8zaJSjhrttDl2PJMjMMbDi51rgE8Lbf5tIE57zL2cPEuFtxT50DO95htUWCMSZ7HMjHXqr',
    },
    params: {
      q: options.searchQuery,
      type: 'track',
      market: 'US',
      limit: 5,
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