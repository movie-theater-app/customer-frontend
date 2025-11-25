import { useState, useEffect } from 'react'
import { theaterApi } from '../api/Fetch'

export default function TheaterDropdown({ onSelectionChange, initialSelection = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theaters, setTheaters] = useState([]);
  const [selectedTheaters, setSelectedTheaters] = useState({});

  useEffect(() => {
    const loadTheaters = async () => {
      try {
        const data = await theaterApi.getAllTheaters();
        setTheaters(data);
        
        let initialSelection = {};
        if (initialSelection.length > 0) {
          // Use provided initial selection
          data.forEach(theater => {
            initialSelection[theater.id] = initialSelection.includes(theater.id);
          });
        } else {
          // Start with all theaters selected
          data.forEach(theater => {
            initialSelection[theater.id] = true;
          });
        }
        setSelectedTheaters(initialSelection);
        
        if (onSelectionChange) {
          const selectedIds = Object.keys(initialSelection)
            .filter(id => initialSelection[id])
            .map(id => parseInt(id));
          onSelectionChange(selectedIds);
        }
      } catch (error) {
        console.error('Failed to load theaters:', error);
      }
    };

    loadTheaters();
  }, [initialSelection.join(',')]);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleTheaterToggle = (theaterId) => {
    setSelectedTheaters(prevSelected => {
      const newSelected = {
        ...prevSelected,
        [theaterId]: !prevSelected[theaterId]
      };
      
      if (onSelectionChange) {
        const selectedIds = Object.keys(newSelected)
          .filter(id => newSelected[id])
          .map(id => parseInt(id));
        onSelectionChange(selectedIds);
      }
      
      return newSelected;
    });
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