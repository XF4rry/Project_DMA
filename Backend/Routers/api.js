var express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');   
const axios = require('axios');
var router = express.Router();

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
    
    if (data.albums.items.length > 0 || data.artists.items.length > 0 || data.tracks.items.length > 0 || data.playlists.items.length > 0) {
        return data; // Restituisce tutti i dati riguardanti la ricerca 
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

    const tokenResponse = await fetch(urlToken, {  
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

// Funzione per cercare l'ID dell'artista
async function getArtistIdByName(artistName, accessToken) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching artist: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.artists.items.length > 0) {
        return data.artists.items[0].id; // Restituisce l'ID del primo artista trovato
    } else {
        throw new Error('No artist found with that name.'); //siums
    }
}

//ricerca l'id della traccia per nome
async function  getTrackIdByName(TrackName, accessToken) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(TrackName)}&type=track`;  //al posto di type ho provato track??

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    console.log(response);

    if (!response.ok) {
        throw new Error(`Error fetching artist: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data && data.tracks && data.tracks.items.length > 0) {
        return data.tracks.items[0].id; // Restituisce l'ID della prima traccia trovata
    } else {
        throw new Error('No track found with that name.');
    }
}

async function getTrackData(trackId, accessToken) {
    const urlTrackData = 'https://api.spotify.com/v1/tracks/' + trackId;   // chiamata api tramite l'id della traccia

    try {
        //const accessToken = await getAccessToken();

        // Ottenere i dati della traccia    
        const trackResponse = await fetch(urlTrackData, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!trackResponse.ok) {
            throw new Error(`Error fetching track data: ${trackResponse.statusText}`);
        }

        const trackData = await trackResponse.json();
        console.log('Track Data:', trackData);
        return(trackData);    //stampa dei dati della traccia

    } catch (error) {
        console.error('Error:', error.message);
        return(error.message);
    }
}


async function getArtistData(artistId, accessToken) {
    const urlArtitsData = 'https://api.spotify.com/v1/artists/' + artistId;   // chiamata api tramite l'id dell'artista

    try {
        //const accessToken = await getAccessToken();

        // Ottenere i dati dell'artista
        const artistResponse = await fetch(urlArtitsData, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!artistResponse.ok) {
            throw new Error(`Error fetching artist data: ${artistResponse.statusText}`);
        }

        const artistData = await artistResponse.json();
        console.log('Artist Data:', artistData);
        return(artistData);    //stampa dei dati dell'artista 

    } catch (error) {
        console.error('Error:', error.message);
        return(error.message);
    }
}
// Endpoint originale per ottenere i dati dell'artista
/*router.post(`/kanye`, async (req, res) => {
    const urlArtitsData = 'https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg';

    try {
        const accessToken = await getAccessToken();

        // Ottenere i dati dell'artista
        const artistResponse = await fetch(urlArtitsData, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!artistResponse.ok) {
            throw new Error(`Error fetching artist data: ${artistResponse.statusText}`);
        }

        const artistData = await artistResponse.json();
        console.log('Artist Data:', artistData);
        res.json(artistData); 

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});*/

module.exports = router;