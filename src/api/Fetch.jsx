// deployed backend address: https://demo-northstar-movie-theatre.azurewebsites.net
// local address since database is not yet deployed
const API_BASE_URL = '/api'; 

// Theaters
export const theaterApi = {
  getAllTheaters: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/theaters/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching theaters:', error);
      throw error;
    }
  },
};

// Schedules
export const scheduleApi = {
  getAllSchedules: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },
};

// Movies
export const movieApi = {
  search: async (query) => {
    try {
      const q = (query || '').trim();
      const url = q
        ? `${API_BASE_URL}/movies?query=${encodeURIComponent(q)}`
        : `${API_BASE_URL}/movies`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) return [];

      if (!q) return data;
      const lowercaseSearch = q.toLowerCase();
      return data.filter((m) => {
        const title = (m.title ?? m.name ?? '').toString().toLowerCase();
        return title.includes(lowercaseSearch);
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  searchWithFilters: async (query, theaterIds = [], selectedDate = null) => {
    try {

      const schedules = await scheduleApi.getAllSchedules();
      
      // Filter schedules by theaters if any are selected
      let filteredSchedules = schedules;
      if (theaterIds && theaterIds.length > 0) {
        filteredSchedules = filteredSchedules.filter(schedule => 
          theaterIds.includes(schedule.theater_id)
        );
      }
      
      // Filter schedules by date
      if (selectedDate) {
        filteredSchedules = filteredSchedules.filter(schedule => {
          const scheduleDate = schedule.screening_date || schedule.date;
          return scheduleDate === selectedDate;
        });
      }
      
      const movieIds = [...new Set(filteredSchedules.map(s => s.movie_id))];
      const allMovies = await movieApi.search(query);
      
      // Filter movies to only those with matching schedules
      const filteredMovies = allMovies.filter(movie => 
        movieIds.includes(movie.id)
      );
      
      return filteredMovies;
    } catch (error) {
      console.error('Error searching movies with filters:', error);
      throw error;
    }
  },
};
