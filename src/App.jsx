import React, { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';

function App() {

   // Step 1: Create a hardcoded array of tracks
   const [tracks, setTracks] = useState([
    { id: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:7lEptt4d6Qn6Pj8pXJOkNj" },
    { id: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", uri: "spotify:track:7oiFFo0vD5oS7z5nGk2U2F" },
    { id: 3, name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:3hPp39Fg0paXcU5RULPb2X" },
    { id: 4, name: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", uri: "spotify:track:5tZzQd2ST1tp8dWldqF9rH" },
    { id: 5, name: "Peaches", artist: "Justin Bieber", album: "Justice", uri: "spotify:track:1lK1z2a3B6I1d3adLpVjwB" }
  ]);


    //holds the name of the playlist
    const [playlistName, setPlaylistName] = useState("My Playlist");


    // holds an array of track object, for now it's hardcoded with mock data
    const [playlistTracks, setPlaylistTracks] = useState ([
      { id: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:7lEptt4d6Qn6Pj8pXJOkNj" },
      { id: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", uri: "spotify:track:7oiFFo0vD5oS7z5nGk2U2F" },
      { id: 3, name: "Save Your Tears", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:3hPp39Fg0paXcU5RULPb2X" }
    ]);
  


      // Method to update playlist name
      const updatePlaylistName = (newName) => {
        setPlaylistName(newName)
      };
  
  
    //Method to add a track to the playlist
    function addTrackToPlaylist(track) {
      //Check if the track is already in the playlist
        if (!playlistTracks.some(existingTrack => existingTrack.id === track.id)) {
          // if not, add the track to the playlist
         setPlaylistTracks([...playlistTracks, track])
        }
    };

    function removeTrackFromPlaylist(track) {
        setPlaylistTracks(prevTracks => prevTracks.filter(existingTrack => existingTrack.id !== track.id))
      
    };


    const saveToSpotify = () => {
      // Collect URIs of the tracks in the playlist
      const trackUris = playlistTracks.map(track => track.uri);
      // Simulate saving the playlist to Spotify by logging the URIs
      console.log("Saving playlist to Spotify with the following URIs:", trackUris)
      // Reset the playlist after saving
      setPlaylistTracks([])
      // Reset the playlist name to default
      setPlaylistName("My Playlist")
    }


  return (
    <div className="App">
      <h1>Ja
        <span className="mmm">mmm</span>
        ing</h1>
      <SearchBar />
      <SearchResults tracks={tracks} onAddTrack={addTrackToPlaylist} />
      <Playlist playlistName={playlistName} playlistTracks={playlistTracks} onRemoveTrack={removeTrackFromPlaylist} updatePlaylistName={updatePlaylistName}  />
      <button onClick={saveToSpotify}>Save to Spotify</button>
    </div>
  );
}

export default App;
