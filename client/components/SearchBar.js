import React, { Component } from 'react';
import FaSearch from 'react-icons/lib/fa/search';

class SearchBar extends Component {

  handleSearch = (e) => {
    e.preventDefault();
    console.log('searching');
    this.props.searchRecipe(this.input.value);
  };

  render() {
    return (
        <div className="search-container">
          <form onSubmit={(e) => this.handleSearch(e)}>
            <input type="text" placeholder="Search for recipes" name="search" ref={(input) => this.input = input}/>
            <button type="submit"><FaSearch color="#5CB3FD"/></button>
          </form>
        </div>
    );
  }
}

export default SearchBar;