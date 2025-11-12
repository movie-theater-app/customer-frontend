import { useState, useEffect } from 'react'
import { theaterApi } from '../api/Fetch'

export default function TheaterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [theaters, setTheaters] = useState([]);
  const [selectedTheaters, setSelectedTheaters] = useState({});

  useEffect(() => {
    const loadTheaters = async () => {
      try {
        const data = await theaterApi.getAllTheaters();
        setTheaters(data);
        
        // Start with all theaters selected
        const initialSelection = {};
        data.forEach(theater => {
          initialSelection[theater.id] = true;
        });
        setSelectedTheaters(initialSelection);
      } catch (error) {
        console.error('Failed to load theaters:', error);
      }
    };

    loadTheaters();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleTheaterToggle = (theaterId) => {
    setSelectedTheaters(prevSelected => ({
      ...prevSelected,
      [theaterId]: !prevSelected[theaterId]
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

  return (
    <div className={`selection ${isOpen ? 'open' : ''}`}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span>{theaterHeaderLabel()}</span>
        <span className="dropdown-arrow">{isOpen ? '⯅' : '⯆'}</span>
      </div>
      {isOpen && (
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
  );
}