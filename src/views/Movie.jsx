import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import '../App.css'
import { movieApi } from '../api/Fetch'
import MovieHeader from '../components/MovieHeader'
import MovieTrailer from '../components/MovieTrailer'
import MovieDetails from '../components/MovieDetails'
import TheaterDropdown from '../components/TheaterDropdown'
import SchedulePicker from '../components/SchedulePicker'
import MovieShowtimes from '../components/MovieShowtimes'
import { useMovieSchedules } from '../components/MovieSchedules'

export default function Movie() {
  const { movieId } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const { movieSchedules, availableTheaterIds, availableDates } = useMovieSchedules(movieId);
  const [selectedTheaters, setSelectedTheaters] = useState(location.state?.selectedTheaters || []);
  const [selectedDate, setSelectedDate] = useState(location.state?.selectedDate || null);

  // Filter schedules based on selected theaters and date
  const filteredSchedules = movieSchedules.filter(schedule => {
    const matchesTheater = selectedTheaters.includes(schedule.theater_id);
    const matchesDate = !selectedDate || schedule.screening_date === selectedDate;
    return matchesTheater && matchesDate;
  });

  // Group schedules by theater
  const groupedSchedules = filteredSchedules.reduce((groups, schedule) => {
    const theaterKey = `${schedule.theater_id}-${schedule.theater_name}`;
    if (!groups[theaterKey]) {
      groups[theaterKey] = {
        theater_id: schedule.theater_id,
        theater_name: schedule.theater_name,
        theater_address: schedule.theater_address,
        showtimes: []
      };
    }
    groups[theaterKey].showtimes.push(schedule);
    return groups;
  }, {});

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
      <MovieHeader />
      {!movie ? (
        console.log('Waiting for movie data')
      ) : (
        <>
          <MovieTrailer trailerUrl={movie.trailer_url} />
          <MovieDetails movie={movie} />
          <div className="separator"></div>
          <div className="movie-bottom-section">
            <div className="movie-page-filters">
              <TheaterDropdown 
                onSelectionChange={setSelectedTheaters}
                initialSelection={selectedTheaters}
              />
              <SchedulePicker 
                onDateChange={setSelectedDate}
                initialDate={selectedDate}
                availableDates={availableDates}
              />
            </div>
            <MovieShowtimes groupedSchedules={groupedSchedules} />
          </div>
        </>
      )}
    </>
  )
}