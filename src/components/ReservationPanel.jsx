import { useEffect, useState } from "react";
import { bookingApi } from "../api/bookingApi";
import { useNavigate } from "react-router-dom";

export default function ReservationPanel({ heldSeats, expiresAt, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(expiresAt - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = expiresAt - Date.now();
      setTimeLeft(Math.max(remaining, 0));

      if (remaining <= 0) {
        onCancel(); // release seats automatically
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [expiresAt, onCancel]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const navigate = useNavigate();

  // proceed to checkout
  const proceedToCheckout = async () => {
    try {
      const formattedSeats = heldSeats.map(id => ({
        row: id[0],
        number: parseInt(id.slice(1), 10)
      }));

      const result = await bookingApi.createBooking(scheduleId, movieId, formattedSeats);

      if (!result.bookingId) {
        alert("Error creating booking");
        return;
      }

      navigate(`/checkout/${result.bookingId}`);
    } catch (err) {
      console.error(err);
      alert("Error when creating booking");
    }
  };


  return (
    <div className="reservation-panel">
      <h3>Your reservation :</h3>
      <p>Seats : {heldSeats.join(", ")}</p>
      <p>Reserved for :  
        <span 
        style={{backgroundColor: "#a37e28ff", 
                padding: "1px 5px",              
                borderRadius: "6px",
                display: "inline-block",
                marginLeft: "5px",
                fontWeight: "600"}} >
        {minutes}:{seconds.toString().padStart(2, "0")}</span></p>

      <button 
        className="checkout-btn"
        onClick={proceedToCheckout}
      > Proceed to checkout</button>
      <button 
        onClick={onCancel} 
        className="cancel-btn">
            Cancel
      </button>
    </div>
  );
}
