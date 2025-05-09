const accessToken = "INSERISCI_IL_TUO_TOKEN_SPOTIFY";
const playlistId = "37i9dQZF1DXcBWIGoYBM5M"; // Esempio: "Today's Top Hits"

let correctTitle = "";

async function getRandomTrack() {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const data = await res.json();

  const tracks = data.items.filter(item => item.track.preview_url);
  const randomTrack = tracks[Math.floor(Math.random() * tracks.length)].track;

  correctTitle = randomTrack.name.toLowerCase();
  const audio = document.getElementById("audio");
  audio.src = randomTrack.preview_url;
  audio.play();
}

document.getElementById("startButton").addEventListener("click", () => {
  getRandomTrack();
  document.getElementById("result").textContent = "";
});

document.getElementById("submitGuess").addEventListener("click", () => {
  const guess = document.getElementById("guessInput").value.trim().toLowerCase();
  const result = document.getElementById("result");
  if (guess === correctTitle) {
    result.textContent = "✅ Corretto!";
    result.style.color = "lightgreen";
  } else {
    result.textContent = `❌ Sbagliato! Era: ${correctTitle}`;
    result.style.color = "red";
  }
});
