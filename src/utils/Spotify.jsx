
const clientId = '7559df79d97445a6ac449b381c7f8708'; // Insert your client ID
const redirectUri = 'http://127.0.0.1:8888/callback'; // Match this with your Spotify App redirect URI

// Generate a random string for the code verifier (PKCE)
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Generate the code challenge using SHA256 (PKCE)
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

// Store the code verifier in localStorage (we need it for the token request)
localStorage.setItem('code_verifier', codeVerifier);

const Spotify = {


//   // ADDED TO CHECK OBTAIN ACCESS TOKEN WORKS! -ALSO CHECK SEARCHBAR COMPONENT!
//    // This function handles searching for tracks using the access token
//    async searchTracks(term) {
//     const token = await this.getAccessToken(); // Get the access token

//     if (!token) {
//       console.error('No valid token found');
//       return;
//     }

//     try {
//       const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const data = await response.json();
//       console.log('Spotify Search Results:', data);
      
//       // You can return or process the data here as needed
//       return data;
//     } catch (error) {
//       console.error('Error searching tracks:', error);
//     }
//   },
// //ALL THE WAY TILL HERE

  // This function handles getting the access token
  async getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Set a timeout to clear the access token after it expires
      window.setTimeout(() => accessToken = '', expiresIn * 1000);

      // Clean up URL by removing access token params
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      // If no token, start the PKCE flow and redirect to Spotify for authorization
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

  // This function exchanges the authorization code for an access token
  async exchangeCodeForToken(code) {
    const codeVerifier = localStorage.getItem('code_verifier'); // Retrieve the code verifier
    const tokenUrl = 'http://127.0.0.1:5000/api/token'; // Point to your backend here

    const body = new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
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

  // Search for tracks using the access token
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

  // Save the playlist to the user's Spotify account
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





