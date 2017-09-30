const HOST = "http://api.giphy.com";
const API_KEY = "SRg5s9nYvyJmaBDnDl0buRQ64dq5NoPQ";
class GiphyApi {
    
    static getTrending(){
        return fetch(`${HOST}/v1/gifs/trending?api_key=${API_KEY}`)
        .then((response) => {
            return response.json();
        }).catch((ex) => {
          console.log('parsing failed', ex)
        })
    }
}

export default GiphyApi;