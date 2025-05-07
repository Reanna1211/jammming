import React from 'react';
import './Track.module.css';

function Track({ name, artist, album }) {
  return (
    <div className="track">
      <div className="track-name">{name}</div> {/* Track name */}
      <div className="track-artist">{artist}</div> {/* Track artist */}
      <div className="track-album">{album}</div> {/* Track album */}
    </div>
  );
}

export default Track;
