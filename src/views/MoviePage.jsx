import { useState } from 'react';
import { Link } from 'react-router-dom';

// Testidata, normaalisti haetaan backendistä
const movies = [
  { id: 1, title: "Movie A" },
  { id: 2, title: "Movie B" }
];
const theaters = [
  { id: 1, name: "Theater 1" },
  { id: 2, name: "Theater 2" }
];

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Find Movies</h1>

      <label>
        Date: <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
      </label>
      <br />
      <label>
        Theater: 
        <select value={selectedTheater} onChange={e => setSelectedTheater(e.target.value)}>
          <option value="">Select</option>
          {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </label>
      <br />
      <label>
        Movie: 
        <select value={selectedMovie} onChange={e => setSelectedMovie(e.target.value)}>
          <option value="">Select</option>
          {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
      </label>

      <h2>Available Movies</h2>
      <ul>
        {movies.filter(m => !selectedMovie || m.id == selectedMovie).map(m => (
          <li key={m.id}>
            {/* Navigoi MovieDetailsPage:lle */}
            <Link to={`/movie/${m.id}?date=${selectedDate}&theater=${selectedTheater}`}>{m.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
