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
            console.log('Dati dell\'artista:', data);
            console.log('ID dell\'artista:', data.id);
            console.log('URL dell\'embed:' + `https://open.spotify.com/embed/${data.type}/${data.id}?utm_source=generator&theme=0`)

            //console.log('vaffanculo');
            // Costruisci l'HTML per aggiornare il contenitore con i dati dell'artista
            //per id dell'artista <p><strong>ID:</strong> ${dati.id}</p>
            
            /*const htmlContent = `
                <p><strong>Nome:</strong> ${dati.name}</p>   
                <p><strong>Genere:</strong> ${dati.genres}</p>
                <p><strong>Tipo:</strong> ${dati.type}</p>
                <img src="${dati.images[0].url}" alt="Immagine dell'artista">
                <style>
                    #responseContainer img {
                        width: 200px;
                        border-radius: 50%;
                        margin: 20px auto;
                    }
                </style>`;*/
            

         
            const htmlContent = `<iframe
        title="Spotify Embed: Recommendation Playlist "
        src='https://open.spotify.com/embed/${data.type}/${data.id}?utm_source=generator&theme=0'
        width="100%"
        height="100%"
        style="border-radius: 12px; overflow: hidden;"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        >`
            // Aggiorna solo la parte della pagina desiderata
            
            document.querySelector('#responseContainer').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
            document.querySelector('#responseContainer').innerHTML = `<p>Errore durante il recupero dei dati.</p>`;
        });
    });
});

