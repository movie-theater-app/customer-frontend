import { useState, useEffect } from 'react';
import { scheduleApi } from '../api/Fetch';

export function useMovieSchedules(movieId) {
  const [movieSchedules, setMovieSchedules] = useState([]);
  const [availableTheaterIds, setAvailableTheaterIds] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const fetchMovieSchedules = async () => {
      if (!movieId) return;
      
      try {
        const allSchedules = await scheduleApi.getAllSchedules();
        const movieSchedulesData = allSchedules.filter(s => s.movie_id === parseInt(movieId));
        setMovieSchedules(movieSchedulesData);
        
        const theaterIds = [...new Set(movieSchedulesData.map(s => s.theater_id))];
        setAvailableTheaterIds(theaterIds);
        
        const dates = [...new Set(movieSchedulesData.map(s => s.screening_date))];
        setAvailableDates(dates);
      } catch (err) {
        console.error('Failed to fetch movie schedules:', err);
      }
    };

    fetchMovieSchedules();
  }, [movieId]);

  return {
    movieSchedules,
    availableTheaterIds,
    availableDates
  };
}
