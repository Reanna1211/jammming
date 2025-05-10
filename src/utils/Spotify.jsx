const clientId = '3da982fbf32641eeacf616e09858b8dd'; // Insert client ID here.
const redirectUri = 'http://127.0.0.1:3000/callback'; // Match this with your Spotify App redirect URI

// Generate a random string for code verifier
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Generate the code challenge using SHA256
const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const generateCodeChallenge = async (codeVerifier) => {
  const hashed = await sha256(codeVerifier);
  return base64encode(hashed);
}

let accessToken;
let codeVerifier = generateRandomString(64); // Generate a new code verifier

// Store code verifier in localStorage
localStorage.setItem('code_verifier', codeVerifier);

const Spotify = {
  async getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => accessToken = '', expiresIn * 1000);

      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const codeChallenge = await generateCodeChallenge(codeVerifier); // Generate code challenge

      const authUrl = new URL("https://accounts.spotify.com/authorize");
      const params = {
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'playlist-modify-public',
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
      };

      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString();
    }
  },

  async exchangeCodeForToken(code) {
    const codeVerifier = localStorage.getItem('code_verifier'); // Retrieve code verifier
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const headers = {
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const body = new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });

    const data = await response.json();
    if (data.access_token) {
      accessToken = data.access_token;
      localStorage.setItem('spotify_access_token', accessToken); // Store token in localStorage
      return accessToken;
    } else {
      throw new Error('Access token not received');
    }
  },

  async search(term) {
    const token = await Spotify.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const jsonResponse = await response.json();
    if (!jsonResponse.tracks) {
      return [];
    }
    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));
  },

  async savePlaylist(name, trackUris) {
    const token = await Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };
    let userId;

    const response = await fetch('https://api.spotify.com/v1/me', { headers: headers });
    const jsonResponse = await response.json();
    userId = jsonResponse.id;

    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({ name: name })
    });

    const playlistData = await playlistResponse.json();
    const playlistId = playlistData.id;

    await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({ uris: trackUris })
    });
  }
};

export default Spotify;
