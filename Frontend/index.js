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
            console.log('Dati ricevuti:', data.playlists.items);
            const htmlContent = `
            <div class="grid-container">
            <div class="grid-item">
                    <h2>Playlist:</h2>
                    <ul>
                        ${data.playlists.items.map(playlist => playlist ? `<li>${playlist.name}</li>` : '').join('')}
                    </ul>
                </div>
             <div class="grid-item">
                    <h2>Tracks:</h2>
                    <ul>
                        ${data.tracks.items.map(track => `<li>${track.name} --> ${track.artists.map(artist => artist.name).join(', ')}</li>`).join('')}
                    </ul>
                </div>
                <div class="grid-item">
                    <h2>Albums:</h2>
                    <ul>
                        ${data.albums.items.map(album => `<li>${album.name}</li>`).join('')}
                    </ul>
                </div>
                <div class="grid-item">
                    <h2>Artists:</h2>
                    <ul>
                        ${data.artists.items.map(artist => `<li>${artist.name}</li>`).join('')}
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

