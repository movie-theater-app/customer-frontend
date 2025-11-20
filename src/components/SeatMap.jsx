import { useState, useEffect } from "react";
import { seatApi } from '../api/seatApi';
import { FaWheelchair } from "react-icons/fa6";
import '../CSS/SeatMap.css';

// SeatMap component with props 
export default function SeatMap({ 
    auditoriumId, 
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
      const data = await seatApi.getSeats(auditoriumId);
      setSeats(data.seats); // array, data already has row, number, status
      setRows(data.rows);
      setColumns(data.columns);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  useEffect(() => {
    if (auditoriumId) fetchSeats();
  }, [auditoriumId]);

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
      </div>
    </>
  );
}











/*import { useState, useEffect } from "react";
import { seatApi } from '../api/seatApi';

export default function SeatMap({ auditoriumId }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Testidataa (10x6 sali)
  const generateMockSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const seats = [];
    for (let r of rows) {
      for (let n = 1; n <= 10; n++) {
        seats.push({
          row: r,
          number: n,
          status: Math.random() < 0.1 ? "reserved" : "available",
        });
      }
    }
    return seats;
  };


  /*const fetchSeats = async () => {
    try {
      const data = await seatApi.getSeats(auditoriumId);
      setSeats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setSeats(generateMockSeats());
  }, [auditoriumId]);

  const toggleSelect = (seat) => {
    const seatId = `${seat.row}${seat.number}`;
    if(seat.status === 'reserved') return;

    if(selectedSeats.includes(seatId)){
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  useEffect(() => {
  const fetchSeats = async () => {
    try {
      const data = await seatApi.getSeats(auditoriumId);
      // Muokataan backendin data frontendin käyttämään muotoon
      const formattedSeats = data.map(s => ({
        row: s.seat_row,
        number: s.seat_number,
        status: s.status
      }));
      setSeats(formattedSeats);
    } catch (error) {
      console.error(error);
    }
  };

  if (auditoriumId) fetchSeats();
}, [auditoriumId]);

  const reserveSeats = async () => {
    if(selectedSeats.length === 0){
      alert("Please select at least one seat.");
      return;
    }
    try {
      const result = await seatApi.reserveSeats(auditoriumId, selectedSeats);
      if(result.success){
        alert('Seats reserved!');
        setSelectedSeats([]);
        fetchSeats();
      } else {
        alert('Some seats already reserved: ' + result.alreadyReserved.join(', '));
        fetchSeats();
      }
    } catch (error) {
      alert('Error reserving seats. See console.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Seat Map</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(10, 40px)`,
        gap: '5px'
      }}>
        {seats.map(seat => {
          const seatId = `${seat.row}${seat.number}`;
          let color = 'green';
          if(seat.status === 'reserved') color = 'gray';
          else if(selectedSeats.includes(seatId)) color = 'blue';

          return (
            <div
              key={seatId}
              onClick={() => toggleSelect(seat)}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: color,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: seat.status === 'reserved' ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {seatId}
            </div>
          );
        })}
      </div>
      <button
        onClick={reserveSeats}
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
        Reserve Selected Seats
      </button>
    </div>
  );
}*/
