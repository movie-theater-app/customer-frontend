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

// Movies
export const movieApi = {
  search: async (query) => {
    try {
      const q = (query || '').trim();
      // If backend doesn't filter, we'll fetch and filter client-side as a fallback
      const url = q
        ? `${API_BASE_URL}/movies?query=${encodeURIComponent(q)}`
        : `${API_BASE_URL}/movies`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) return [];

      // Client-side fallback filtering to handle backends that ignore the query param
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
};
