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
            // Costruisci l'HTML per aggiornare il contenitore con i dati dell'artista
            const htmlContent = `
                <p><strong>Nome:</strong> ${data.artistName}</p>
                <p><strong>ID:</strong> ${data.artistId}</p>
            `;
            
            // Aggiorna solo la parte della pagina desiderata
            document.querySelector('#responseContainer').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
            document.querySelector('#responseContainer').innerHTML = `<p>Errore durante il recupero dei dati.</p>`;
        });
    });
});

