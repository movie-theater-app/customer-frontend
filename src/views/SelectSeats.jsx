import SeatMap from '../components/SeatMap';
import { useParams } from 'react-router-dom';
import logo from '../assets/logo.png'
import '../App.css'


export default function SeatMapPage() {
  const { auditoriumId } = useParams(); // Get auditorium ID from URL

  return (
    <div style={{ padding: '20px' }}>
       <img src={logo} className="logo"/>
        <h1>Choose your seats</h1>
      <SeatMap auditoriumId={auditoriumId} />
    </div>
  );
}
