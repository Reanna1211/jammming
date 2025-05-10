
import React from 'react';
import Track from '../Track/Track';
import './Tracklist.module.css';

function Tracklist( { tracks, onRemoveTrack }) {
  return (
    <div className="tracklist">
      <h3>Tracklist</h3>
    
      {tracks.map(track => (
         <div key={track.id} className="track-container">
         <Track 
         key={track.id}
         name={track.name}
         artist={track.artist}
         album={track.album}
         />
         <button className="remove-button" onClick={() => onRemoveTrack(track)}>-</button>{/* Remove button */}
         </div>
      )
      
      )}
      
      
    </div>
  );
}

export default Tracklist;
