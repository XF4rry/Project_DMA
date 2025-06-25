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
                'x-service': 'api'
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
                    <h2 id:"title">Playlist:</h2>
                    <ul>
                        ${datiSearch.playlists.items.map(playlist => `<li><img id="playlistCover" src= "${playlist?.images[0]?.url || 'https://png.pngtree.com/png-vector/20241012/ourlarge/pngtree-cat-listening-to-music-with-headphones-png-image_13995938.png'}" height="40px" width="40px" alt=""><a href="" onclick="document.getElementById('player').src = 'https://open.spotify.com/embed/playlist/${playlist?.id}?utm_source=generator&theme=0'; setCookie('playlistId', '${playlist?.id}', 4); return false;"> ${playlist?.name}</a></li>`).join('')}
                    </ul>
                </div>
             <div class="grid-item">
                    <h2 id:"title">Tracks:</h2>
                    <ul>
                        ${datiSearch.tracks.items.map(track => `<li>  <img id="trackCover" src="${track.album.images[0]?.url || 'https://png.pngtree.com/png-vector/20241012/ourlarge/pngtree-cat-listening-to-music-with-headphones-png-image_13995938.png'}" height="40px" width="40px" alt=""> <a href="" onclick="document.getElementById('player').src = 'https://open.spotify.com/embed/track/${track?.id}?utm_source=generator&theme=0'; setCookie('trackId', '${track?.id}', 4); return false;">${track?.name}  -  ${track.artists.map(artist => artist?.name).join(', ')}</a></li>`).join('')}
                    </ul>
                </div>
                <div class="grid-item">
                    <h2 id:"title">Albums:</h2>
                    <ul>
                        ${datiSearch.albums.items.map(album => `<li><img id="albumCover" src= "${album.images[0]?.url || 'https://png.pngtree.com/png-vector/20241012/ourlarge/pngtree-cat-listening-to-music-with-headphones-png-image_13995938.png'}" height="40px" width="40px" alt=""><a href="" onclick="document.getElementById('player').src = 'https://open.spotify.com/embed/album/${album?.id}?utm_source=generator&theme=0'; setCookie('albumId', '${album?.id}', 4); return false;"> ${album?.name}  -  ${album.artists.map(artist => artist?.name).join(', ')}</a></li>`).join('')}
                    </ul>
                </div>
                <div class="grid-item">
                    <h2 id:"title">Artists:</h2>
                    <ul>
                        ${datiSearch.artists.items.map(artist => `<li>${artist?.name}</li>`).join('')}
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

            //<img id="albumCover" src="${track.album.images[0].url}" height="40px" width="40px" alt="${track.name}">
            
            document.querySelector('#responseContainer').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
            document.querySelector('#responseContainer').innerHTML = `<p>Errore durante il recupero dei dati.</p>`;
        });
    });

    $("#myFormGen").submit(function(event) {
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
                'x-service': 'ai'
            },
            body: JSON.stringify(formDataJson), // Invia i dati come JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Converte la risposta in testo
        })
        .then(data => {
            /*const htmlContent = `
            <h2>Risultati dell'intelligenza artificiale</h2>
            <p class="risposta">
                ${data}
            </p>
            `;
            
            document.querySelector('#responseContainerAI').innerHTML = htmlContent;*/

            updateAIResponse(data, 'Gemini dice:'); // Usa la funzione per aggiornare la risposta
        })
        .catch(error => { 
            console.error('Errore nella richiesta:', error);
            document.querySelector('#responseContainerAI').innerHTML = `<p>Errore durante il recupero dei dati.</p>`;
        });
    });


});


/*$(document).ready(function() {
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
                'x-service': 'api'
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
});*/


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

// Funzione per formattare la risposta dell'AI
function formatAIResponse(text) {
    if (!text) return '';
    
    // Dividi il testo in paragrafi più piccoli per una migliore leggibilità
    let formatted = text
        // Sostituisci punti seguiti da spazio e maiuscola con paragrafi
        .replace(/\. ([A-Z])/g, '.\n\n$1')
        // Aggiungi interruzioni per frasi molto lunghe
        .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
        // Gestisci le liste con asterischi
        .replace(/\* /g, '\n• ')
        // Gestisci i due punti seguiti da maiuscola (per sottotitoli)
        .replace(/: ([A-Z])/g, ':\n\n**$1')
        // Chiudi il grassetto dopo il punto
        .replace(/\*\*([^*]+)\./g, '**$1**.')
        // Pulisci spazi multipli
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
    
    return formatted;
}

// Funzione per creare HTML strutturato dalla risposta
function createStructuredHTML(text) {
    const container = document.createElement('div');
    
    // Dividi il testo in sezioni
    const sections = text.split('\n\n');
    
    sections.forEach(section => {
        if (!section.trim()) return;
        
        // Controlla se è un titolo (inizia con **testo**)
        if (section.match(/^\*\*[^*]+\*\*/)) {
            const h3 = document.createElement('h3');
            h3.textContent = section.replace(/\*\*/g, '');
            container.appendChild(h3);
        }
        // Controlla se è una lista
        else if (section.includes('• ')) {
            const ul = document.createElement('ul');
            const items = section.split('\n• ').filter(item => item.trim());
            items.forEach(item => {
                if (item.startsWith('• ')) item = item.substring(2);
                const li = document.createElement('li');
                li.textContent = item.trim();
                ul.appendChild(li);
            });
            container.appendChild(ul);
        }
        // Paragrafo normale
        else {
            const p = document.createElement('p');
            p.textContent = section.trim();
            container.appendChild(p);
        }
    });
    
    return container.innerHTML;
}

// Modifica la gestione del form per migliorare la visualizzazione
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myFormGen');
    const responseContainer = document.getElementById('responseContainerAI');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            // Mostra indicatore di caricamento
            responseContainer.innerHTML = '<div class="loading">Elaborazione in corso...</div>';
            responseContainer.style.display = 'block';
        });
    }
});

// Funzione per aggiornare la risposta dell'AI (da chiamare quando ricevi la risposta)
function updateAIResponse(responseText, title = 'Risultati dell\'intelligenza artificiale') {
    const container = document.getElementById('responseContainerAI');
    
    if (!container) return;
    
    // Crea il contenuto formattato
    const formattedText = formatAIResponse(responseText);
    const structuredHTML = createStructuredHTML(formattedText);
    
    // Aggiorna il contenitore
    container.innerHTML = `
        <div class="title">${title}</div>
        ${structuredHTML}
    `;
    
    // Aggiungi animazione di fade-in
    container.style.opacity = '0';
    container.style.display = 'block';
    
    setTimeout(() => {
        container.style.transition = 'opacity 0.5s ease-in-out';
        container.style.opacity = '1';
    }, 100);
}
document.addEventListener('DOMContentLoaded', function() {

    const btnSearch = document.getElementById("clearBtnSearch");
    const btnAI = document.getElementById("clearBtnAI");
    const containerSearch = document.getElementById("responseContainer");
    const containerAI = document.getElementById("responseContainerAI");
    const ricercaSearch = document.getElementById("querySearch");
    const ricercaAI = document.getElementById("queryGen");


    // Aggiungi un gestore di eventi per il pulsante di reset della ricerca
    btnAI.addEventListener("click", () => {
      containerAI.innerHTML = "";
      ricercaAI.value = ""; // Pulisce il campo di input della ricerca AI
    });
    
    btnSearch.addEventListener("click", () => {
      containerSearch.innerHTML = "";
      ricercaSearch.value = ""; // Pulisce il campo di input della ricerca
    });

});
