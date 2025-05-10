const clientId = '3da982fbf32641eeacf616e09858b8dd'; // Replace with  client ID
const redirectUri = 'http://127.0.0.1:5174/callback'; // The redirect URI you registered
const scopes = 'playlist-modify-public playlist-modify-private'; // Required Spotify permissions
const authEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';

// Redirect the user to the Spotify login page
export const redirectToSpotifyAuth = () => {
  const state = generateRandomState();
  const authUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;
  window.location = authUrl; // Redirect to Spotify
};

// Generate a random state string for security (prevents CSRF attacks)
const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Extract the access token from the URL (this happens after the user logs in)
export const getAccessTokenFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.hash.substring(1)); // Extract from URL hash fragment
  const accessToken = urlParams.get('access_token');
  const tokenType = urlParams.get('token_type');
  const expiresIn = parseInt(urlParams.get('expires_in'));

  if (!accessToken) {
    console.error('Access token not found in URL.');
    return null;
  }

  // Store the access token and its expiration time
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_access_token', accessToken);
  localStorage.setItem('spotify_token_expiration', expirationTime);

  return accessToken; // Return the access token
};

// Retrieve the access token from localStorage (if valid)
export const getAccessToken = () => {
  const storedToken = localStorage.getItem('spotify_access_token');
  const expirationTime = localStorage.getItem('spotify_token_expiration');

  if (storedToken && expirationTime && Date.now() < expirationTime) {
    return storedToken; // Return the stored token if valid
  } else {
    localStorage.removeItem('spotify_access_token'); // Clear expired token
    localStorage.removeItem('spotify_token_expiration');
    return null; // No valid token found
  }
};

// Clear the access token and expiration time from localStorage
export const clearAccessToken = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expiration');
};
