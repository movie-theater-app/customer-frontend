const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // http://localhost:3001/api -> port may differ

export const movieApi = {
  getAllMovies: async () => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/movies/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  getMovieById: async (id) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/movies/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching movie with id ${id}:`, error);
      throw error;
    }
  },
}
  