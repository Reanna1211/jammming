import React from 'react';
import './SearchResults.module.css';

function SearchResults() {
  return (
    <div className="search-results">
      <h2>Results</h2>
      {/* Mock data here */}
      <div className="results-list">
        <p>No results yet</p>
      </div>
    </div>
  );
}

export default SearchResults;
