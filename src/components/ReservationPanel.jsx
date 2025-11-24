import { useEffect, useState } from "react";

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

      <button className="checkout-btn">Proceed to checkout</button>
      <button 
        onClick={onCancel} 
        className="cancel-btn">
            Cancel
      </button>
    </div>
  );
}
