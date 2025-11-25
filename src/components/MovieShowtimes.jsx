import ShowtimeCard from './ShowtimeCard';

export default function MovieShowtimes({ groupedSchedules }) {
  return (
    <div className="movie-showtimes">
      <h2>Available Showtimes</h2>
      {Object.keys(groupedSchedules).length > 0 ? (
        <div className="showtimes-container">
          {Object.values(groupedSchedules).map((theater) => (
            <div key={theater.theater_id} className="theater-group">
              <div className="showtime-theater-info">
                <h3 className="showtime-theater">{theater.theater_name}</h3>
                <div className="showtime-theater-address">{theater.theater_address}</div>
              </div>
              <div className="theater-showtimes">
                {theater.showtimes.map((schedule) => (
                  <ShowtimeCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-showtimes">No showtimes for this day!</div>
      )}
    </div>
  );
}
