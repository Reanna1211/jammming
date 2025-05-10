import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from "./utils/Spotify";

function App() {
   // Step 1: Create a hardcoded array of tracks
   const [tracks, setTracks] = useState([
    { id: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours" },
    { id: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia" },
    { id: 3, name: "Save Your Tears", artist: "The Weeknd", album: "After Hours" },
    { id: 4, name: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR" },
    { id: 5, name: "Peaches", artist: "Justin Bieber", album: "Justice" }
  ]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([
    { id: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:7lEptt4d6Qn6Pj8pXJOkNj" },
    { id: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", uri: "spotify:track:7oiFFo0vD5oS7z5nGk2U2F" },
    { id: 3, name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:3hPp39Fg0paXcU5RULPb2X" }
  ]);

  return (
    <div className="App">
      <h1>Ja<span className="mmm">mmm</span>ing</h1>
      <SearchBar />
      <SearchResults tracks={tracks} />
      <Playlist />
    </div>
  );
}

export default App;