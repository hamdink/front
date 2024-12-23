// Search.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons'; // Import the icon for "Show All"
import './search.css';

const Search = ({ setData ,title,name="Nom"}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      setData(searchTerm);
    }
  };

  const handleShowAll = () => {
    setSearchTerm('');
    setData('');
  };

  return (
    <div className="search-container">
      <div className="show-all" onClick={handleShowAll}>
        <FontAwesomeIcon icon={faUsers} className="show-all-icon" />
        <span className="show-all-text">{title}</span>
      </div>
      <div className="search">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder={name}
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Search;
