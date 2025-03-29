const data = fetch('http://localhost:3000/getData', headers = { 'Content-Type': 'application/json','x-service': 'game'}).then(response  => response.json()); // Carica i dati degli artisti
let currentArtist, nextArtist;
let score = 0;
let nick;

function getRandomArtist() {
    return data[Math.floor(Math.random() * data.length)];
}

//controlla questo
function displayArtist(artist, elementId) {
    document.getElementById(elementId).innerHTML = `
        <h2>${artist.title}</h2>
        <img src="${artist.sourceImage}" alt="${artist.title}">   
        <p>Play Count: ${artist.playCount}</p>
    `;
}

function startGame() {
    currentArtist = getRandomArtist();
    nextArtist = getRandomArtist();
    while (currentArtist.id === nextArtist.id) {
        nextArtist = getRandomArtist();
    }
    displayArtist(currentArtist, "current");
    displayArtist(nextArtist, "next"); 
}

function gameEnd(score){
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
    // Confronta il valore di playCount dell'artista corrente con l'artista successivo
    // e stabilisce se la risposta dell'utente  corretta o meno
    // Se "isHigher"  true, la risposta  corretta se il valore di playCount dell'artista successivo 
    //  maggiore del valore di playCount dell'artista corrente
    // Altrimenti, se "isHigher"  false, la risposta  corretta se il valore di playCount dell'artista successivo 
    //  minore del valore di playCount dell'artista corrente
    let correct = isHigher ? nextArtist.playCount > currentArtist.playCount : nextArtist.playCount < currentArtist.playCount;
    if (correct) {
        score++;
        document.getElementById("score").innerText = score;
        nick = document.getElementById("Nickname").innerText;
        currentArtist = nextArtist;
        nextArtist = getRandomArtist();
        while (currentArtist.id === nextArtist.id) {
            nextArtist = getRandomArtist();
        }
        displayArtist(currentArtist, "current");
        displayArtist(nextArtist, "next");
    } else {
        alert("Game Over! Your score: " + score);
        score = 0;
    }
}

document.getElementById("current").addEventListener("click", () => checkGuess(false));
document.getElementById("next").addEventListener("click", () => checkGuess(true));
document.getElementById("btn").addEventListener("click", startGame());
