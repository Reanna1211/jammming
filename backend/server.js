const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

// Step 1: Redirect to Spotify's authorization page
app.get('/login', (req, res) => {
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = {
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'playlist-modify-public',
    code_challenge_method: 'S256',
    // Include code_challenge here if you're using PKCE (generate and pass it)
  };
  authUrl.search = new URLSearchParams(params).toString();
  res.redirect(authUrl.toString());
});

// Step 2: Handle the redirect and exchange code for token
app.get('/callback', async (req, res) => {
  const code = req.query.code; // The code sent by Spotify

  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
    }));

    const accessToken = tokenResponse.data.access_token;
    res.json({ access_token: accessToken }); // You can send this to the frontend or store it securely
  } catch (error) {
    console.error('Error exchanging code for token', error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend is running on http://127.0.0.1:${PORT}`);
});
