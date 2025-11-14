// deployed backend address: https://demo-northstar-movie-theatre.azurewebsites.net
// local address is set via VITE_API_BASE_URL in .env
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const seatApi = {
  // get all seats for a specific auditorium
  getSeats: async (auditoriumId) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/seats/${auditoriumId}/seats`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching seats:', error);
      throw error;
    }
  },

  // reserve selected seats for a specific auditorium
  reserveSeats: async (auditoriumId, selectedSeats) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/seats/${auditoriumId}/seats/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats: selectedSeats }) // auditoriumId is now in URL
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to reserve seats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error reserving seats:', error);
      throw error;
    }
  }
};
