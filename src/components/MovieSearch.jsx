import { useState } from 'react'
import { movieApi } from '../api/Fetch'

export default function MovieSearch({ onResults, onSearched }) {
  const [query, setQuery] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await movieApi.search(query.trim());
      const list = Array.isArray(data) ? data : [];
      onResults && onResults(list);
      onSearched && onSearched(true);
    } catch (err) {
      console.error('Movie search failed:', err);
    }
  };

  return (
    <div className="movie-search">
      <form onSubmit={onSubmit} className="search-input-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="Search movies"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" type="submit">Search</button>
      </form>
    </div>
  );
}