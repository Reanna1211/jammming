import React from 'react';
import './SearchResults.module.css';
import Track from '../Track/Track';  // Import the Track component

function SearchResults({ tracks }) {
  return (
    <div className="search-results">
      <h2>Results</h2>
      <div className="results-list">
        {tracks.map(track => (
          <Track
            key={track.id}
            name={track.name}
            artist={track.artist}
            album={track.album}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;

