$(document).ready(function() {
    // Gestore di eventi per il submit del form
    $("#myFormYE").submit(function(event) {
        event.preventDefault(); // Evita il comportamento predefinito del form

        // Serializza i dati del form
        const formData = new FormData(this); // Raccoglie tutti i dati del form
        const actionUrl = this.getAttribute('action'); // Recupera l'endpoint dal form

        // Crea un oggetto per convertire FormData in JSON
        const formDataJson = {};
        formData.forEach((value, key) => {
            formDataJson[key] = value;
        });

        // Effettua una richiesta POST usando Fetch
        fetch(actionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataJson), // Invia i dati come JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Converte la risposta in JSON
        })
        .then(data => {
            //const [datiSearch, accessToken] = data.split('|');
            const datiSearch = data[0];
            const accessToken = data[1];
            console.log('Dati ricevuti:', datiSearch.playlists.items);
            console.log(accessToken);
            const htmlContent = `
            <div class="grid-container">
            <div class="grid-item">
                    <h2>Playlist:</h2>
                    <ul>
                        ${datiSearch.playlists.items.map(playlist => playlist ? `<li>${playlist.name}</li>` : '').join('')}
                    </ul>
                </div>
             <div class="grid-item">
                    <h2>Tracks:</h2>
                    <ul>
                        ${datiSearch.tracks.items.map(track => `<li><a href="" onclick="document.getElementById('player').src = 'https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0'; setCookie('trackId', '${track.id}', 4); return false;"> ${track.name}  -  ${track.artists.map(artist => artist.name).join(', ')}</a></li>`).join('')}
                    </ul>
                </div>
                <div class="grid-item">
                    <h2>Albums:</h2>
                    <ul>
                        ${datiSearch.albums.items.map(album => `<li><a href="" onclick="document.getElementById('player').src = 'https://open.spotify.com/embed/album/${album.id}?utm_source=generator&theme=0'; setCookie('albumId', '${album.id}', 4); return false;"> ${album.name}  -  ${album.artists.map(artist => artist.name).join(', ')}</a></li>`).join('')}
                    </ul>
                </div>
                <div class="grid-item">
                    <h2>Artists:</h2>
                    <ul>
                        ${datiSearch.artists.items.map(artist => `<li>${artist.name}</li>`).join('')}
                    </ul>
                </div>
               
            </div>
            `;
         //player che worka da sistemare solo grafica 
         
            /*const htmlContent = `<iframe
        title="Spotify Embed: Recommendation Playlist "
        src='https://open.spotify.com/embed/${data.type}/${data.id}?utm_source=generator&theme=0'
        width="100%"
        height="100%"
        style="border-radius: 12px; overflow: hidden;"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        >`*/    //player servirà dopo
            // Aggiorna solo la parte della pagina desiderata
            
            document.querySelector('#responseContainer').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
            document.querySelector('#responseContainer').innerHTML = `<p>Errore durante il recupero dei dati.</p>`;
        });
    });
});


$(document).ready(function() {
    // Gestore di eventi per il submit del form
    $("#myFormLogin").submit(function(event) {
        event.preventDefault(); // Evita il comportamento predefinito del form

        // Serializza i dati del form
        const formData = new FormData(this); // Raccoglie tutti i dati del form
        const actionUrl = this.getAttribute('action'); // Recupera l'endpoint dal form

        // Effettua una richiesta POST usando Fetch
        fetch(actionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Converte la risposta in JSON
        })
        .then(data => {
            

        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
            document.querySelector('#responseContainer').innerHTML = `<p>Errore durante il recupero dei dati.</p>`;
        });
    });
});


/*async function saveCookies() {
    const cookies = document.cookie.split('; ');
    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        localStorage.setItem(name, value);
    });
}*/
//ogni volta che si cambia una canzone il coockie viene aggiornato 
function setCookie(name, value, exdays) {
    const cookies = document.cookie.split(';');  
    const d = new Date();                             // definisce la data di iniziazione del cookie

    d.setTime(d.getTime() + (exdays*60*60*1000));     //crea il tag expires prendendo l'ora attuale e mettendo la scandenza tra 4 ore
    let expires = "expires="+ d.toUTCString();        //converte l'expires in carattere UTC
    
    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if(name == this.name){
            cookies.splice(cookies.indexOf(cookie), 1);
        }
    });
    // Imposta un nuovo cookie con il nome e il valore specificati
    // Include anche la data di scadenza e il percorso
    document.cookie = `${name}=${value};${expires};`;                //concatenazione degli attributi del cookie
    cookies.push(name, value, expires);
}

function controlloAccount (){
    if (document.cookie.includes('access_token')) {
        document.getElementById('myFormLogin').style.display = 'none';
        document.getElementById('myFormLogout').style.display = 'block';
    }
}

function logout() {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';  //metto la scadenza del cookie nella passato così si cancella da solo
    document.getElementById('myFormLogin').style.display = 'block';
    document.getElementById('myFormLogout').style.display = 'none'; 
}