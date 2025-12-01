import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieApi } from '../api/Fetch';

export default function TrendingMovies({ selectedTheaters, selectedDate }) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const movies = await movieApi.search('');
        // Sort by ID, "15" represents the amount of movies to show
        const sortedMovies = movies.sort((a, b) => b.id - a.id).slice(0, 15);
        setTrendingMovies(sortedMovies);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`, {
      state: {
        selectedTheaters,
        selectedDate
      }
    });
  };

  return (
    <div className="carousel">
      {trendingMovies.length > 0 ? (
        trendingMovies.map((movie) => (
          <div
            key={movie.id}
            className="movie-box"
            style={{
              backgroundImage: `url(${movie.poster_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer'
            }}
            title={movie.title || ''}
            onClick={() => handleMovieClick(movie.id)}
          ></div>
        ))
      ) : (
        <>
          <div className="movie-box"></div>
          <div className="movie-box"></div>
          <div className="movie-box"></div>
          <div className="movie-box"></div>
          <div className="movie-box"></div>
        </>
      )}
    </div>
  );
}
