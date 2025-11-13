import SeatMap from '../components/SeatMap';
import { useParams } from 'react-router-dom';

export default function SeatMapPage() {
  const { auditoriumId } = useParams(); // hakee auditorion ID:n URL:sta

  return (
    <div style={{ padding: '20px' }}>
      <h1>Choose your seats</h1>
      <SeatMap auditoriumId={auditoriumId} />
    </div>
  );
}
