import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SeatMap from '../components/SeatMap';
import ReservationPanel from "../components/ReservationPanel";
import { seatApi } from "../api/seatApi";
import Navbar from '../components/Navbar';
import '../CSS/ReservationPanel.css';

export default function SelectSeatsPage() {
  const { auditoriumId } = useParams(); // get auditorium ID from URL
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState([]);
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);

   const fetchSeats = async () => {
    try {
      await seatApi.getSeats(auditoriumId); // pelkkä refresh, SeatMap hoitaa setSeats
    } catch (err) {
      console.error("Error fetching seats:", err);
    }
  };

  // function to reserve selected seats
  const reserveSelected = async () => {
    try {
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat!")
      return;
      }
      const result = await seatApi.reserveSeats(auditoriumId, selectedSeats);

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
        await seatApi.releaseSeats(auditoriumId, heldSeats);
        setHeldSeats([]);
        setHoldExpiresAt(null);
        await fetchSeats();
      } catch (error) {
        alert("Error releasing seats");
        console.error(error);
      } 
    };

     // Kun timer menee nollaan, vapautetaan paikat automaattisesti
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
        <h1>Choose your seats</h1>
      <SeatMap 
        auditoriumId={auditoriumId}
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
          expiresAt={holdExpiresAt}
          onCancel={cancelHold}
        />
      )}

    </div>
  );
}