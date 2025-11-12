import { useState } from 'react'
import TheaterDropdown from '../components/TheaterDropdown'
import MovieSearch from '../components/MovieSearch'
import logo from '../assets/logo.png'
import date_picker from '../assets/date-picker.png'
import '../App.css'

function Main() {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <>
      <img src={logo} className="logo"/>
      <div className="top-section">
        <h1>Trending</h1>
        <div className="carousel">
          <div className="movie-box"></div>
          <div className="movie-box"></div>
          <div className="movie-box"></div>
          <div className="movie-box"></div>
          <div className="movie-box"></div>
        </div>
      </div>
      <div className="separator"></div>
      <div className="bottom-section">
        <h2>Choose theaters</h2>
        <TheaterDropdown />
  <h2>Select movie</h2>
  <MovieSearch onResults={setSearchedMovies} onSearched={setHasSearched} />
        <h2>Select date</h2>
        <img src={date_picker} className="date-picker" />
        <div className="date-display">6th of November</div>
        <div className="movies-container">
          {hasSearched ? (
            searchedMovies && searchedMovies.length > 0 ? (
              searchedMovies.map((m, idx) => {
                const key = m.id ?? `${idx}-${m.poster_url}`;
                const style = m.poster_url
                  ? { backgroundImage: `url(${m.poster_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : {};
                return <div key={key} className="movie-box-big" style={style} title={m.title || ''}></div>;
              })
            ) : (
              <div className="no-results">No movies found!</div>
            )
          ) : (
            <>
              <div className="movie-box-big"></div>
              <div className="movie-box-big"></div>
              <div className="movie-box-big"></div>
              <div className="movie-box-big"></div>
            </>
          )}
        </div>
      </div>
      <footer className="contact-info-footer">
        <div>Kino Baltic Turku:   +358 2 2641 7520</div>
        <div>Cinema Nova Oulu:   +358 8 5542 3890</div>
        <div>Elokuvateatteri Helsinki Central:   +358 9 4257 6180</div>
      </footer>
    </>
  )
}
export default Main