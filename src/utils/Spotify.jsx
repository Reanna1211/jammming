const clientId = '3da982fbf32641eeacf616e09858b8dd'; // Insert client ID here.
const clientSecret = '00cc7eba5e1b4eeabd163420f600923a';
const redirectUri = 'http://127.0.0.1:5174/callback'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.

const code = new URLSearchParams(window.location.search).get('code');  // Get the code from the URL



let accessToken;

const Spotify = {
     // Get the access token from URL or localStorage
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check if the token is in the URL (after user is redirected back to your app)
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Set a timeout to clear the access token after it expires
      window.setTimeout(() => accessToken = '', expiresIn * 1000);

       // Clear parameters from the URL after access token is retrieved
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
    
    // If no access token in the URL, redirect user to Spotify login page
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

   // Exchange the authorization code for an access token
   exchangeCodeForToken(code) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const headers = {
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`), // Base64 encoded client_id:client_secret
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    // Fetch the access token
    return fetch(tokenUrl, {
      method: 'POST',
      headers: headers,
      body: body
    })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          accessToken = data.access_token;
          localStorage.setItem('spotify_access_token', accessToken); // Store token in localStorage
          return accessToken;
        } else {
          throw new Error('Access token not received');
        }
      })
      .catch(error => {
        console.error('Error during token exchange:', error);
      });
  },


// Search for tracks using the access token
  async search(term) {
    const token = Spotify.getAccessToken();
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
  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const token = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      })
      .then(response => response.json())
      .then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      });
    });
  }
};

export default Spotify;
