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

// Funzione per ottenere il token di accesso
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

// Endpoint per cercare l'ID dell'artista dal nome
router.post(`/search-artist`, async (req, res) => {
    const artistName = req.body.artistName; // Ottieni il nome dell'artista dal corpo della richiesta

    try {
        const accessToken = await getAccessToken();
        const artistId = await getArtistIdByName(artistName, accessToken);
        res.json({ artistId });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

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