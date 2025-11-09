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
