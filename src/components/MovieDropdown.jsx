import { useState, useEffect } from 'react'
import { theaterApi } from '../api/Fetch'

export default function MovieDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`selection ${isOpen ? 'open' : ''}`}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span>Select a movie!</span>
        <span className="dropdown-arrow">{isOpen ? '⯅' : '⯆'}</span>
      </div>
      {isOpen && (
        <div className="dropdown">
          
        </div>
      )}
    </div>
  );
}