// deployed backend address: https://demo-northstar-movie-theatre.azurewebsites.net
// local address since database is not yet deployed
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export const seatApi = {
  // Hae kaikki paikat auditoriossa
  getSeats: async (auditoriumId) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/auditoriums/${auditoriumId}/seats`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching seats:', error);
      throw error;
    }
  },

  // Varaa valitut paikat
  reserveSeats: async (auditoriumId, selectedSeats) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditoriumId, seats: selectedSeats })
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