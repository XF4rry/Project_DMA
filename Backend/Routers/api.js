var express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');   
const axios = require('axios');
var router = express.Router();
const crypto = require('crypto');

router.use(BodyParser.json());
router.use(BodyParser.urlencoded({ extended: true }));
router.use(cors());

const clientId = '9ef96b2e27c342bd9337c8b8e0dc6c94'; 
const clientSecret = 'da530e0dbb10490b95c12fda03ecc390';  
const urlToken = 'https://accounts.spotify.com/api/token'; 




// Endpoint per cercare l'ID dell'artista dal nome
router.post(`/search-artist`, async (req, res) => {
    const search = req.body.search; // Ottieni il nome dell'artista dal corpo della richiesta

    try {                  
        const accessToken = await getAccessToken();
        /*const trackId= await getTrackIdByName(search, accessToken);   //cambiato il primo parametro di ricerca
        const artistId = await getArtistIdByName(search, accessToken);  
        const artistData = await getArtistData(artistId, accessToken);
        console.log('Artist Data:', artistData.name + " " + artistData.id + " " + artistData.genres + " " + artistData.type);
        res.json({ artistData });
        const trackData= await getTrackData(trackId, accessToken);
        res.json(trackData);*/  //ricerche singole

        const data = await searchGeneralizzato(search, accessToken);
        res.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

async function searchGeneralizzato(ricerca, accessToken){
    const url = `https://api.spotify.com/v1/search?q=${ricerca}&type=album%2Cartist%2Ctrack%2Cplaylist&limit=5`;

    const response = await fetch(url, {
        method: 'GET',  //imposto il metodo (get o post)
        headers: {
            'Authorization': `Bearer ${accessToken}`,       //imposto i parametri richiesti dall'api    (allego il token)
            'Content-Type': 'application/json'              //per fare la richiesta     (imposto il tipo di dato che voglio ricevere, in questo caso in JSON)
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching artist: ${response.statusText}`);
    }

    
    
    
    const data = await response.json();  
    console.log("dati: " + data);

   const accessTokenHash = crypto.createHash('sha256');    //crea un hash
    accessTokenHash.update(accessToken);    //mette il token dentro il hash
    const accessTokenHashString = accessTokenHash.digest('hex');    //mette il hash dentro una stringa digest in hex
    console.log('Access Token Hash:', accessTokenHashString);   //stampo il hash 

    const dati = [data, accessTokenHashString]
    
    if (data.albums.items.length > 0 || data.artists.items.length > 0 || data.tracks.items.length > 0 || data.playlists.items.length > 0) {
        return dati // restituisce i dati e li mette dentro un json mettendo l'hash dell'access token separati da un carattere specifico
    } else {
        throw new Error('Nothing found with that name.'); //siums
    }
}

// Funzione per ottenere il token di accesso // finita sta merda maybe
async function getAccessToken() {
    const params = new URLSearchParams();  
    params.append('grant_type', 'client_credentials');  
    params.append('client_id', clientId);  
    params.append('client_secret', clientSecret);  

    const tokenResponse = await fetch(urlToken, {      //metodo per ottenere il token
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded',  
        },  
        body: params,  
    });

    if (!tokenResponse.ok) {
        throw new Error(`Error fetching token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;  
}


module.exports = router;