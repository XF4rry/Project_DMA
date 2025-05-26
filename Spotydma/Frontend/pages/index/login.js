const clientId = "9ef96b2e27c342bd9337c8b8e0dc6c94"; // id web app spotify
const code = undefined;
async function init() {
    console.log("login con frontend");
    const accessToken = await getAccessToken(clientId, code);
        if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const profile = await fetchProfile(accessToken);
        console.log(profile);
        console.log(accessToken);
        //populateUI(profile);
         
    }

}



$(document).ready(function() {
    // Gestore di eventi per il submit del form
    $("#myFormLogin").submit(function(event) {
        event.preventDefault(); // Evita il comportamento predefinito del form
        init();
        
    });
});

async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://spotydma.web.app/");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;

}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://spotydma.web.app/");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    if (result.ok) {        //salvo nei cookie l'hash dell'access token
        const { access_token } = await result.json();
        const hash = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(access_token));
        const cookieValue = btoa(String.fromCharCode.apply(null, [...new Uint8Array(hash)]))
            .replace(/\+/g, '-')                
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        document.cookie = `spotydmaAccessToken=${cookieValue}; SameSite=Strict; Secure; Path=/`;
    }
    const { access_token } = await result.json();
    return access_token;
}

// link per il redirect alla pagina di logout : https://accounts.spotify.com/

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const element = document.getElementById("accedi"); //non ammazzarmi
    element.innerText = "Esci";
    return await result.json();
}