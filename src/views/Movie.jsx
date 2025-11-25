import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import homebtn from '../assets/home.png'
import '../App.css'
import { movieApi } from '../api/Fetch'
import TheaterDropdown from '../components/TheaterDropdown'
import SchedulePicker from '../components/SchedulePicker'
import MovieTrailer from '../components/MovieTrailer'
import { useMovieSchedules } from '../components/MovieSchedules'

export default function Movie() {
  const { movieId } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const { availableTheaterIds, availableDates } = useMovieSchedules(movieId);
  const [selectedTheaters, setSelectedTheaters] = useState(location.state?.selectedTheaters || []);
  const [selectedDate, setSelectedDate] = useState(location.state?.selectedDate || null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        console.log('Fetching movie with ID:', movieId);
        const data = await movieApi.getById(movieId);
        console.log('Received movie data:', data);
        setMovie(data);
      } catch (error) {
        console.error('Failed to fetch movie:', error);
        setMovie(null);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  return (
    <>
        <div>
            <img src={logo} className="logo"/>
            <img src={homebtn} className="back-button" onClick={() => window.history.back()} alt="Back" />
        </div>
        {!movie ? (
          console.log('Waiting for movie data')
        ) : (
          <>
            <MovieTrailer trailerUrl={movie.trailer_url} />
            <div className="movie-details">
                <h1 className="movie-title">{movie.title}</h1>
                <p className="movie-description">{movie.description}</p>
                <div className="movie-poster"><img src={movie.poster_url} /></div>
            </div>
            <div className="separator"></div>
            <div className="movie-page-filters">
                <TheaterDropdown 
                  onSelectionChange={setSelectedTheaters}
                  initialSelection={selectedTheaters}
                  availableTheaterIds={availableTheaterIds}
                />
                <SchedulePicker 
                  onDateChange={setSelectedDate}
                  initialDate={selectedDate}
                  availableDates={availableDates}
                />
            </div>
          </>
        )}
    </>
  )
}