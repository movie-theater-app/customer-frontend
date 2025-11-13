// deployed backend address: https://demo-northstar-movie-theatre.azurewebsites.net
// local address since database is not yet deployed
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

// Theaters
export const theaterApi = {
  getAllTheaters: async () => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/theaters/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching theaters:', error);
      throw error;
    }
  },

  getTheaterById: async (id) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/theaters/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching theater with id ${id}:`, error);
      throw error;
    }
  },
};

export const auditoriumApi = {
  getAllAuditoriums: async () => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/auditoriums/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching auditoriums:', error);
      throw error;
    }
  },

  getAuditoriumsByTheater: async (theaterId) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/auditoriums/theater/${theaterId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching auditoriums for theater ${theaterId}:`, error);
      throw error;
    }
  },
};
