import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from "./utils/Spotify";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [tracks, setTracks] = useState([
    { id: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:7lEptt4d6Qn6Pj8pXJOkNj" },
    { id: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", uri: "spotify:track:7oiFFo0vD5oS7z5nGk2U2F" },
    { id: 3, name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:3hPp39Fg0paXcU5RULPb2X" },
    { id: 4, name: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", uri: "spotify:track:5tZzQd2ST1tp8dWldqF9rH" },
    { id: 5, name: "Peaches", artist: "Justin Bieber", album: "Justice", uri: "spotify:track:1lK1z2a3B6I1d3adLpVjwB" }
  ]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([
    { id: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:7lEptt4d6Qn6Pj8pXJOkNj" },
    { id: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", uri: "spotify:track:7oiFFo0vD5oS7z5nGk2U2F" },
    { id: 3, name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:3hPp39Fg0paXcU5RULPb2X" }
  ]);

  const search = useCallback((term) => {
    Spotify.search(term).then(setSearchResults);
  }, []);

  const updatePlaylistName = (newName) => setPlaylistName(newName);

  const addTrackToPlaylist = (track) => {
    if (!playlistTracks.some(existingTrack => existingTrack.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  const removeTrackFromPlaylist = (track) => {
    setPlaylistTracks(prevTracks => prevTracks.filter(existingTrack => existingTrack.id !== track.id));
  };

  const savePlaylist = useCallback(() => {
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  }, [playlistName, playlistTracks]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      Spotify.exchangeCodeForToken(code).then(token => {
        console.log('Access Token:', token);
      });
    }
  }, []);

  return (
    <div className="App">
      <h1>Ja<span className="mmm">mmm</span>ing</h1>
      <SearchBar />
      <SearchResults tracks={tracks} onAddTrack={addTrackToPlaylist} />
      <Playlist playlistName={playlistName} playlistTracks={playlistTracks} onRemoveTrack={removeTrackFromPlaylist} updatePlaylistName={updatePlaylistName} />
      <button onClick={savePlaylist}>Save to Spotify</button>
    </div>
  );
}

export default App;
