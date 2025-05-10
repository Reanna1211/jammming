import React from 'react';
import './Tracklist.module.css';
import Track from '../Track/Track'; // Import the Track component

function Tracklist({ tracks, onRemoveTrack }) {
  return (
    <div className="tracklist">
      {tracks.map(track => (
        <div key={track.id} className="track-container">
          <Track
            name={track.name}
            artist={track.artist}
            album={track.album}
          />
          <button className="remove-button" onClick={() => onRemoveTrack(track)}>-</button> {/* Remove button */}
        </div>
      ))}
    </div>
  );
}

export default Tracklist;


