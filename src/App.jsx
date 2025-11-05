import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [theaters, setTheaters] = useState([]);
  const [selectedTheaters, setSelectedTheaters] = useState({});
  const [openDropdownName, setOpenDropdownName] = useState(null);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const response = await fetch('/api/theaters/');
      const data = await response.json();
      setTheaters(data);
      
      // Start with all theaters selected
      const initialSelection = {};
      data.forEach(theater => {
        initialSelection[theater.id] = true;
      });
      setSelectedTheaters(initialSelection);

    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  const handleTheaterToggle = (theaterId) => {
    setSelectedTheaters(prev => ({
      ...prev,
      [theaterId]: !prev[theaterId]
    }));
  };

  const getSelectedTheaterNames = () => {
    return theaters
    .filter(theater => selectedTheaters[theater.id])
    .map(theater => theater.name);
  };

  const theaterHeaderLabel = () => {
    const names = getSelectedTheaterNames();
    if (names.length > 1) return 'Multiple theaters selected';
    if (names.length === 1) return names[0];
    return 'Select a theater!';
  };

  const toggleDropdown = (menu) => {
    setOpenDropdownName(prev => (prev === menu ? null : menu));
  };

  return (
    <>
      <h2>Choose theaters</h2>
      <div className={`selection ${openDropdownName === 'theaters' ? 'open' : ''}`}>
        <div className="dropdown-header" onClick={() => toggleDropdown('theaters')}>
          <span>{theaterHeaderLabel()}</span>
          <span className="dropdown-arrow">{openDropdownName === 'theaters' ? '⯅' : '⯆'}</span>
        </div>
        {openDropdownName === 'theaters' && (
          <div className="dropdown">
            {theaters.map(theater => (
              <div key={theater.id} className="dropdown-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTheaters[theater.id] || false}
                    onChange={() => handleTheaterToggle(theater.id)}
                  />
                  {theater.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default App
