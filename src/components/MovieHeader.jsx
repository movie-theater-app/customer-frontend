import logo from '../assets/logo.png';
import homebtn from '../assets/home.png';

export default function MovieHeader() {
  return (
    <div>
      <img src={logo} className="logo" alt="Logo" />
      <img 
        src={homebtn} 
        className="back-button" 
        onClick={() => window.history.back()} 
        alt="Back" 
      />
    </div>
  );
}
