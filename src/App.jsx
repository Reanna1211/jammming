import React, { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';

function App() {
   // Step 1: Create a hardcoded array of tracks
   const [tracks, setTracks] = useState([
    { id: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours" },
    { id: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia" },
    { id: 3, name: "Save Your Tears", artist: "The Weeknd", album: "After Hours" },
    { id: 4, name: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR" },
    { id: 5, name: "Peaches", artist: "Justin Bieber", album: "Justice" }
  ]);

  return (
    <div className="App">
      <h1>Ja
        <span className="mmm">mmm</span>
        ing</h1>
      <SearchBar />
      <SearchResults tracks={tracks} />
      <Playlist />
    </div>
  );
}

export default App;