import { Link } from 'react-router-dom';

export default function MoviePage() {
  // Kovakoodattu esimerkkidata
  const movie = {
    id: 1,
    title: "Example Movie",
    description: "This is an example movie description.",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  };

  // Teatterit ja auditoriot / näytösajat
  const theaters = [
    { 
      id: 1, 
      name: "Theater One", 
      auditoriums: [
        { id: 101, name: "Auditorium A", showtimes: ["18:00", "20:00"] },
        { id: 102, name: "Auditorium B", showtimes: ["19:00"] }
      ] 
    },
    { 
      id: 2, 
      name: "Theater Two", 
      auditoriums: [
        { id: 201, name: "Auditorium C", showtimes: ["17:00", "21:00"] }
      ]
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      <div>
        <iframe 
          width="560" 
          height="315" 
          src={movie.trailer} 
          title="Trailer" 
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>

      <h2>Showtimes by Theater</h2>
      {theaters.map(theater => (
        <div key={theater.id} style={{ marginTop: "20px" }}>
          <h3>{theater.name}</h3>
          {theater.auditoriums.map(aud => (
            <div key={aud.id} style={{ marginLeft: "20px" }}>
              <strong>{aud.name}</strong>
              <div style={{ marginTop: "5px" }}>
                {aud.showtimes.map(time => (
                  <Link 
                    key={time} 
                    to={`/seat-map/${aud.id}`} 
                    style={{ marginRight: "10px", padding: "5px 10px", border: "1px solid black", borderRadius: "4px", textDecoration: "none" }}
                  >
                    {time}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
