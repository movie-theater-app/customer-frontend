import { useNavigate } from 'react-router-dom';

export default function ShowtimeCard({ schedule }) {
  const navigate = useNavigate();

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  return (
    <div className="showtime-card">
      <div className="showtime-time">{schedule.screening_time}</div>
      <div className="auditorium-arrow">⯈</div>
      <div 
        className="select-auditorium" 
        onClick={() => navigate(`/seat-map/${schedule.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="showtime-auditorium">{schedule.auditorium_name}</div>
        <div className="showtime-start-time">
          {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
        </div>
      </div>
    </div>
  );
}
