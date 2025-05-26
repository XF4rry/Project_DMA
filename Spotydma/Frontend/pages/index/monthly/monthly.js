document.addEventListener('DOMContentLoaded', function() {
    let dati = [];
    let currentArtist = "";
    let nextArtist = "";
    let score = 0;
    let nick = "";
    let datiImmagini = [];

    fetch('http://localhost:3001/getImagesMonth', { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json', 
            'x-service': 'game'
        }, 
        body: JSON.stringify({})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Dati ricevuti dal server:", data);
        if (data && data.urls) {
            datiImmagini = data.urls;
        } else {
            console.error("I dati non contengono 'urls' o sono malformati");
        }
    })
    .catch(error => {
        console.error('Errore durante il fetch dei dati:', error);
    });

    document.getElementById('startGameBtn').addEventListener('click', startGame);

    function startGame() {
        score = 0;
        currentArtist = getRandomArtist();
        nextArtist = getRandomArtist();
        while (currentArtist.title === nextArtist.title) {
            nextArtist = getRandomArtist();
        }
        displayArtist(currentArtist, "current");
        displayArtist(nextArtist, "next");
        document.getElementById('score').innerText = score;
    }

    function getRandomArtist() {
        const i = Math.floor(Math.random() * dati.length);
        return dati[i];
    }

    async function displayArtist(artist, elementId) {
        try {
            const img = datiImmagini.find(item => item.nome == artist.title)?.url || 'https://live.staticflickr.com/3271/2438128901_f6fcf23134_b.jpg';
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = `
                    <h2>${artist.title}</h2>
                    <img src="${img}" alt="${artist.title}">
                    <p>Play Count: ${artist.playCount}</p>
                `;
            } else {
                console.error(`Element with id ${elementId} not found.`);
            }
        } catch {
            console.error("errore");
        }
    }

    function gameEnd(score) {
        const nick = document.getElementById("Nickname").innerText;
        fetch('/saveScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-service': 'game'
            },
            body: JSON.stringify({score: score, nick: nick}),
        }).then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Errore durante il salvataggio del punteggio:', error));
    }

    function checkGuess(isHigher) {
        let correct = isHigher ? nextArtist.playCount > currentArtist.playCount : nextArtist.playCount < currentArtist.playCount;
        if (correct) {
            score++;
            document.getElementById("score").innerText = score;
            currentArtist = nextArtist;
            nextArtist = getRandomArtist();
            while (currentArtist.title === nextArtist.title) {
                nextArtist = getRandomArtist();
            }
            displayArtist(currentArtist, "current");
            displayArtist(nextArtist, "next");
        } else {
            alert("Game Over! Your score: " + score);
            gameEnd(score);
            score = 0;
        }
    }
});

