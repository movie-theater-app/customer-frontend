import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SeatMap from '../components/SeatMap';
import ReservationPanel from "../components/ReservationPanel";
import { seatApi } from "../api/seatApi";
import Navbar from '../components/Navbar';
import '../CSS/reservationPanel.css';

export default function SelectSeatsPage() {
  const { scheduleId } = useParams(); // get schedule ID from URL
  const [movieId, setMovieId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState([]);
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [allSeats, setAllSeats] = useState([]); // stores all seat data. including seat_id

  /*useEffect(() => {
    // fetch schedule info from API
    const fetchSchedule = async () => {
      const data = await scheduleApi.getSchedule(scheduleId);
    };
    fetchSchedule();
    }, [scheduleId]); */

   // Fetch seats and movie info from seatApi
  const fetchSeats = async () => {
    try {
      const data = await seatApi.getSeats(scheduleId); 
      setAllSeats(data.seats);
      if (!movieId && data.seats.length > 0) setMovieId(data.seats[0].movie_id);
    } catch (err) {
      console.error("Error fetching seats:", err);
    }
  };

    useEffect(() => {
    if (scheduleId) fetchSeats();
  }, [scheduleId]);

  // function to reserve selected seats
  const reserveSelected = async () => {
    try {
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat!")
      return;
      }
      const result = await seatApi.reserveSeats(scheduleId, selectedSeats);

      if (result.success) {
        alert("Seats reserved on hold for you!");
        setHeldSeats(selectedSeats);
        setHoldExpiresAt(Date.now() + 5 * 60 * 1000); // 5 min
      } else {
        alert("Some seats were already reserved: " + JSON.stringify(result.alreadyReserved));
        fetchSeats();
      } 
    } catch (error) {
        alert("Error reserving seats");   
        console.error(error);
      }
    }
    // function to cancel seats on hold
    const cancelHold = async () => {
      if (!heldSeats.length) return;
      try {
        await seatApi.releaseSeats(scheduleId, heldSeats);
        setHeldSeats([]);
        setHoldExpiresAt(null);
        await fetchSeats();
      } catch (error) {
        alert("Error releasing seats");
        console.error(error);
      } 
    };

     // When timer hits zero, seats are released automatically 
  useEffect(() => {
    if (!holdExpiresAt) return;
    const interval = setInterval(() => {
      if (Date.now() >= holdExpiresAt) {
        cancelHold();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt]);


  return (
    <div>
       <Navbar />
        <h1 style= {{marginTop: "2rem"}}>Choose your seats</h1>
      <SeatMap 
        scheduleId={scheduleId}
        onSelectionChange={setSelectedSeats}
        heldSeats={heldSeats}
        locked={heldSeats.length > 0}  // lock seat map if seats are on hold
         />

      <div className="reserve-btn-container">
        <button className="reserve-button" onClick={reserveSelected}>
          Reserve selected seats
        </button>
      </div>

      {heldSeats.length > 0 && (
        <ReservationPanel 
          heldSeats={heldSeats}
          allSeats={allSeats}
          scheduleId={scheduleId}
          movieId={movieId}
          expiresAt={holdExpiresAt}
          onCancel={cancelHold}
        />
      )}

    </div>
  );
}