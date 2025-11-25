import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import homebtn from '../assets/home.png'
import '../App.css'
import { movieApi } from '../api/Fetch'
import TheaterDropdown from '../components/TheaterDropdown'
import SchedulePicker from '../components/SchedulePicker'

export default function Movie() {
  const { movieId } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
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

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // If already an embed URL, return as is
    if (url.includes('/embed/')) return url;
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    // If not a YouTube URL, return original
    return url;
  };

  if (!movie) {
    return (
      <div>
        <img src={logo} className="logo"/>
        <img src={homebtn} className="back-button" onClick={() => window.history.back()} alt="Back" />
        <div>Loading movie... (ID: {movieId})</div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(movie.trailer_url);

  return (
    <>
        <div>
            <img src={logo} className="logo"/>
            <img src={homebtn} className="back-button" onClick={() => window.history.back()} alt="Back" />
        </div>
        <div className="movie-trailer-container">
            <div className="movie-trailer">
              {embedUrl && (
                <iframe
                  src={embedUrl}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
            </div>
        </div>
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
            />
            <SchedulePicker 
              onDateChange={setSelectedDate}
              initialDate={selectedDate}
            />
        </div>
    </>
  )
}