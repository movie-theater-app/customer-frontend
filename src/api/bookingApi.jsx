const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const bookingApi = {
  createBooking: async (scheduleId, movieId, seats) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/bookings/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId, movieId, seats })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create booking");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }
};
