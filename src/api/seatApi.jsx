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

  // reserve selected seats for a specific auditorium (for hold first)
  reserveSeats: async (auditoriumId, selectedSeats) => {
    const formattedSeats = selectedSeats.map(id => ({
      row: id[0],
      number: parseInt(id.slice(1), 10)
    }));

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/seats/${auditoriumId}/seats/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditoriumId,
          seats: formattedSeats
        }) 
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
  },
  // release held seats
  releaseSeats: async (auditoriumId, seatsToRelease) => {
      try {
        const formattedSeats = seatsToRelease.map(id => ({
          row: id[0],
          number: parseInt(id.slice(1), 10)
        }));

        const response = await fetch(`${VITE_API_BASE_URL}/seats/${auditoriumId}/seats/release`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seats: formattedSeats })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to release seats');
        }

        return await response.json();
      } catch (error) {
        console.error('Error releasing seats:', error);
        throw error;
      }
    }
};
