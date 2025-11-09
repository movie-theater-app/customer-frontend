// this was previously /api but when i tested locally just "/" was working
const API_BASE_URL = 'https://demo-northstar-movie-theatre.azurewebsites.net'; 

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
