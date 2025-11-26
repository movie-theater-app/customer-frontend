const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const scheduleApi = {

  // get single schedule based on id
  getSchedule: async (scheduleId) => {
    const response = await fetch(`${VITE_API_BASE_URL}/schedules/${scheduleId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

}