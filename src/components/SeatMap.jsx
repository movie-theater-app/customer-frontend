import { useState, useEffect } from "react";
import { seatApi } from '../api/seatApi';
import { FaWheelchair } from "react-icons/fa6";
import '../CSS/seatMap.css';

// SeatMap component with props 
export default function SeatMap({ 
    scheduleId, 
    onSelectionChange, 
    heldSeats = [], 
    locked = false }) {

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);

  // Fetch seats from backend
  const fetchSeats = async () => {
    try {
      const data = await seatApi.getSeats(scheduleId);
      console.log("Seat API data:", data);

      setSeats(data.seats); // array, data already has row, number, status
      setRows(data.rows);
      setColumns(data.columns);

      console.log("Seats state:", data.seats);
      console.log("Rows:", data.rows, "Columns:", data.columns);

    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };  

  useEffect(() => {
    if (scheduleId) fetchSeats();
  }, [scheduleId]);

  useEffect(() => {
    onSelectionChange(selectedSeats);
  }, [selectedSeats]);

  const toggleSelect = (seat) => {
    if (seat.status === 'reserved' || locked) { 
      if (locked) alert("Cancel previous selections first!"); // prevent selection if locked
      return;
    }
    const seatId = `${seat.row}${seat.number}`;
    const availableSeat = selectedSeats.includes(seatId);

    const newSeatList = availableSeat
      ? selectedSeats.filter(seat => seat !== seatId)
      : [...selectedSeats, seatId];

    setSelectedSeats(newSeatList); 
  };

  return (
    <>
      <div className="seat-map-container">
         <div className="info-section">
            <div className="info-item">
              <span className="info-color" style={{backgroundColor: 'green'}}></span> Available
            </div>
            <div className="info-item">
              <span className="info-color" style={{backgroundColor: 'orange'}}></span> Selected
            </div>
            <div className="info-item">
              <span className="info-color" style={{backgroundColor: 'rgb(201, 2, 2)'}}></span> Reserved
            </div>
            <div className="info-item">
              <span ><FaWheelchair /></span> Wheelchair/disabled seat
            </div>
         </div>
        <div className="seat-map-grid"
          style={{ gridTemplateColumns: `repeat(${columns}, 20px)` }}>
          {seats.map(seat => {
            const seatId = `${seat.row}${seat.number}`;
            const isWheelchair = seat.seat_type === "disabled";

            let seatClass = 'seat available';
            if (seat.status === 'reserved') seatClass = "seat reserved";
            else if (heldSeats.includes(seatId)) seatClass = 'seat on-hold';
            else if (selectedSeats.includes(seatId)) seatClass = "seat selected";
            if (isWheelchair) seatClass += " wheelchair";
            if (locked) seatClass += " locked";
            
            return (
              <div
                key={seatId}
                className={seatClass}
                onClick={() => toggleSelect(seat)}
              >
                {isWheelchair ? <FaWheelchair /> : seatId}
              </div>
            );
          })}
        </div>
        <div className="screen-label"> Screen </div>
      </div>
    </>
  );
}
