import React, { useState } from 'react';
import './SearchBar.module.css';

function SearchBar() {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log('Searching for:', query);
    // You will later hook this up to the Spotify API
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter A Song Title"
        value={query}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;

