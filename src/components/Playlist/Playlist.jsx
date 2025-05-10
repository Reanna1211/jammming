import React, { useState} from 'react';
import Tracklist from '../Tracklist/Tracklist';
import './Playlist.module.css';

function Playlist({ playlistName, playlistTracks, onRemoveTrack, updatePlaylistName }) {
    // State to track if the playlist name is being edited
  const [isEditing, setIsEditing] = useState(false);
    // State to manage the new playlist name
  const [newPlaylistName, setNewPlaylistName] = useState(playlistName)

    // Handle click on playlist name (toggle editing)
    const handleTitleClick = () => {
      setIsEditing(true);
    }

      // Handle change in input field (updating playlist name)
      const handleNameChange = (e) => {
        setNewPlaylistName(e.target.value)
      }
      // onKeyDown event to the input field that listens for the Enter key (keyCode === 13) and saves the new playlist name when Enter is pressed.
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {  // Check if the pressed key is Enter
          setIsEditing(false); // Stop editing mode
          if (newPlaylistName !== playlistName) {
            updatePlaylistName(newPlaylistName); // Update the playlist name in App.jsx
          }
        }
      };

      // Handle when the user finishes editing. In the context of the playlist renaming functionality, onBlur is used to save the changes (i.e., update the playlist name) when the user finishes editing the name by clicking away or clicking outside the input field.

      const handleBlur = () => {
        setIsEditing(false);

        // If the name is updated, pass it back to the parent component (App.jsx)
        if (newPlaylistName !== playlistName) {
          updatePlaylistName(newPlaylistName)
        }
      }

   

     

  return (
    <div className="playlist">
      <h2> {isEditing ? ( 
        <input 
        type="text"
        value={newPlaylistName}
        onChange={handleNameChange}
        onBlur={handleBlur} //Save the new name when input loses focus
        onKeyDown={handleKeyDown}
        autoFocus // Automatically focus on the input when editing
        />
      ) : (
        <span onClick={handleTitleClick}>{ playlistName }</span> // Clickable title for editing
      
       )}
       </h2>
      
      <Tracklist tracks={ playlistTracks } onRemoveTrack = {onRemoveTrack} />
    </div>
  );
}

export default Playlist;