let artists = i; // Carica i dati degli artisti
let currentArtist, nextArtist;
let score = 0;

function getRandomArtist() {
    return artists[Math.floor(Math.random() * artists.length)];
}

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
}

function checkGuess(isHigher) {
    let correct = isHigher ? nextArtist.playCount > currentArtist.playCount : nextArtist.playCount < currentArtist.playCount;
    if (correct) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        currentArtist = nextArtist;
        nextArtist = getRandomArtist();
        while (currentArtist.id === nextArtist.id) {
            nextArtist = getRandomArtist();
        }
        displayArtist(currentArtist, "current");
    } else {
        alert("Game Over! Your score: " + score);
        score = 0;
        startGame();
    }
}

document.getElementById("higher").addEventListener("click", () => checkGuess(true));
document.getElementById("lower").addEventListener("click", () => checkGuess(false));

startGame();