import React, { useState } from 'react';
import './SearchBar.module.css';

//IMPORT SPOTIFY COMPONENT
// import Spotify from '../../utils/Spotify';

function SearchBar() {
  const [query, setQuery] = useState('');
  // const [searchResults, setSearchResults] = useState([]); // State to hold search results


  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log('Searching for:', query);
    // You will later hook this up to the Spotify API
  };

//   // In your React component (e.g., App.jsx or SearchBar.jsx) THIS WAS ADDED TO VERIFY ACCESS TOKEN ABOVE WAS ORIGINAL CODE
// const handleSearch = () => {
//   if (query) {
//     Spotify.searchTracks(query).then(data => {
//       setSearchResults(data.tracks.items || [])
//       // Do something with the data, like updating the state with search results
//     console.log('Search Results:', data);
  
//   }) .catch (error => {
//       console.error("Error searching for tracks:", error)
//     })
//   } else {
//     console.log("Please enter a search term")
//   };
// };

// //UP UNTIL HERE


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

