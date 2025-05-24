document.addEventListener('DOMContentLoaded', function() {
    // Variabili del gioco
    let score = 0;
    let currentSong = null;
    let hintsLeft = 3;
    let timer = null;
    let timeLeft = 15;
    
    // Database delle canzoni
    /*const songs = [
        { title: "Nothing Changed", artist: "Quavo", id: "37If4sC0Si28T6z63qhR5z", hints: ["non si cambial", "Hip-Hop americano", "Only Built for Infinity Links"] },
        { title: "Lose Yourself", artist: "Eminem", id: "7MJQ9Nfxzh8LPZ9e9u68Fq", hints: ["Rap God", "Oscar", "8 Mile"] },
        { title: "99 Problems", artist: "Jay-Z", id: "7IdFdRlCjUi6kkhbPoRfnw", hints: ["Rap iconico", "Roc-A-Fella", "Problemi"] },
        { title: "Gold Digger", artist: "Kanye West", id: "1bAO5Ob5wYq5sEqf3ThFFP", hints: ["Chiama sua madre", "Rap/R&B", "College Dropout"] },
        { title: "Squabble Up", artist: "Kendrick Lamar", id: "0nj9Bq5sHDiTxSHunhgkFb", hints: ["Diss 2024/2025", "K-dot", "New Broccoli"] },
        { title: "Unforgettable", artist: "French Montana & Swae Lee", id: "3B54sVLJ402zGa6Xm4YGNe", hints: ["Reggaeton", "Can't get you outta ma mind", "Album: Jungle Rules"] },
        { title: "California Love", artist: "2Pac", id: "3ia3dJETSOllPsv3LJkE35", hints: ["Rap old school", "West Coast", "A Classic"] },
        { title: "WAP", artist: "Cardi B, Megan Thee Stallions, Nicki Minaj", id: "4Oun2ylbjFKMPTiaSbbCih", hints: ["Regine del Rap", "Twerk", "TikTok viral"] },
        { title: "Trap Queen", artist: "Fetty Wap", id: "0TzxcB6dK46vgXZT2P8qeR", hints: ["Rap del New Jersey", "Trap", "Fetty Wap"] },
        { title: "A Milli", artist: "Lil Wayne", id: "3uqinR4FCjLv28bkrTdNX5", hints: ["Rap del Sud", "Weezy", "The Carter III"] }
    ];*/
    // Serializza i dati del form
        const actionUrl = "http://localhost:3001/getSongGuessr"; // Recupera l'endpoint dal form

        // Effettua una richiesta POST usando Fetch
        fetch(actionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-service': 'game'
            },
            body: JSON.stringify({})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Converte la risposta in JSON
        })
        .then(songs => {
          let previousIndexes
          // Elementi DOM
          const startGameBtn = document.getElementById('start-game');
          const srcPlayer = document.getElementById('player');
          const srcPlayerGuess = document.getElementById('playerGuess');
          const playClipBtn = document.getElementById('play-clip');
          const submitGuessBtn = document.getElementById('submit-guess');
          const getHintBtn = document.getElementById('get-hint');
          const skipSongBtn = document.getElementById('skip-song');
          const nextSongBtn = document.getElementById('next-song');
          const endGameBtn = document.getElementById('end-game');
          const playAgainBtn = document.getElementById('play-again');
          
          const welcomeScreen = document.getElementById('welcome-screen');
          const gameScreen = document.getElementById('game-screen');
          const resultScreen = document.getElementById('result-screen');
          const gameOverScreen = document.getElementById('game-over-screen');
          
          const songGuessInput = document.getElementById('song-guess');
          const hintText = document.getElementById('hint-text');
          const hintsLeftSpan = document.getElementById('hints-left');
          const scoreDisplay = document.getElementById('score');
          const finalScoreDisplay = document.getElementById('final-score');
          const resultMessage = document.getElementById('result-message');
          const songTitle = document.getElementById('song-title');
          const songArtist = document.getElementById('song-artist');
          const timeDisplay = document.getElementById('time-display');
          const progressBar = document.getElementById('progress');
          
          // Cambiare schermata
          function showScreen(screen) {
              [welcomeScreen, gameScreen, resultScreen, gameOverScreen].forEach(s => {
                  if (s === screen) {
                      s.classList.remove('hidden-screen');
                      s.classList.add('active-screen');
                  } else {
                      s.classList.add('hidden-screen');
                      s.classList.remove('active-screen');
                  }
              });
          }
          
          // Inizia il gioco
          startGameBtn.addEventListener('click', function() {
              showScreen(gameScreen);
              startRound();
              randomIndexes = [];
          });
          
          // Simula la riproduzione di un clip musicale
          playClipBtn.addEventListener('click', function() {
              // Reset timer
              clearInterval(timer);
              timeLeft = 15;
              updateTimer();
              
              // Start new timer
              timer = setInterval(function() {
                  timeLeft--;
                  updateTimer();
                  if (timeLeft <= 0) {
                      clearInterval(timer);
                      showResult(false);
                  }
              }, 1000);
          });
          //diocane
          
          // Aggiorna il timer visivo
          function updateTimer() {
              const seconds = timeLeft < 10 ? '0' + timeLeft : timeLeft;
              timeDisplay.textContent = `00:${seconds}`;
              const progressWidth = (timeLeft / 15) * 100;
              progressBar.style.width = `${progressWidth}%`;
          }
          
          // Submit guess
          submitGuessBtn.addEventListener('click', function() {
              checkGuess();
          });
          
          songGuessInput.addEventListener('keyup', function(event) {
              if (event.key === 'Enter') {
                  checkGuess();
              }
          });
          
          // Check if the guess is correct
          function checkGuess() {
              const guess = songGuessInput.value.trim().toLowerCase();
              if (!guess) return;
              
              const isCorrect = guess === currentSong.title.toLowerCase();
              showResult(isCorrect);
          }
          
          // Get a hint
          getHintBtn.addEventListener('click', function() {
              if (hintsLeft > 0) {
                  const hintIndex = 3 - hintsLeft;
                  if (hintIndex < currentSong.hints.length) {
                      hintText.textContent = currentSong.hints[hintIndex];
                      hintsLeft--;
                      hintsLeftSpan.textContent = `${hintsLeft} indizi rimasti`;
                  }
              }
              
              if (hintsLeft <= 0) {
                  getHintBtn.disabled = true;
              }
          });
          
          // Skip song
          skipSongBtn.addEventListener('click', function() {
              showResult(false);
          });
          
          // Next song
          nextSongBtn.addEventListener('click', function() {
              showScreen(gameScreen);
              startRound();
          });
          
          // End game
          endGameBtn.addEventListener('click', function() {
              finalScoreDisplay.textContent = score;
              showScreen(gameOverScreen);
          });
          
          // Play again
          playAgainBtn.addEventListener('click', function() {
              score = 0;
              scoreDisplay.textContent = score;
              showScreen(welcomeScreen);
          });
          
          // Start a new round
          function startRound() {
              // Clear previous
              songGuessInput.value = '';
              
              hintText.textContent = 'Usa un indizio per ricevere aiuto';
              hintsLeft = 3;
              hintsLeftSpan.textContent = `${hintsLeft} indizi rimasti`;
              getHintBtn.disabled = false;
              clearInterval(timer);
              timeLeft = 15;
              updateTimer();
              
              // Select a random song
              let randomIndex;
              do {
                  randomIndex = Math.floor(Math.random() * songs.length);
              } while (previousIndexes.includes(randomIndex));
              previousIndexes.push(randomIndex);
              currentSong = songs[randomIndex];
              srcPlayer.setAttribute('src',`https://open.spotify.com/embed/track/${currentSong.id}?utm_source=generator&theme=0`);
          }
          
          // Show result
          function showResult(isCorrect) {
              clearInterval(timer);
              
              if (isCorrect) {
                  score += 10;
                  scoreDisplay.textContent = score;
                  resultMessage.textContent = 'Corretto!';
                  resultMessage.classList.add('correct');
                  resultMessage.classList.remove('incorrect');
              } else {
                  resultMessage.textContent = 'Sbagliato!';
                  resultMessage.classList.add('incorrect');
                  resultMessage.classList.remove('correct');
              }
              srcPlayerGuess.setAttribute('src',`https://open.spotify.com/embed/track/${currentSong.id}?utm_source=generator&theme=0`);
              songTitle.textContent = currentSong.title;
              songArtist.textContent = currentSong.artist;
              showScreen(resultScreen);
          }
        })
        .catch(error => {
            console.error('Error:', error);
        })
});

