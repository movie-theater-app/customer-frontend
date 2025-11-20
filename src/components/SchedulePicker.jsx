import { useState, useEffect, useRef } from 'react'
import { scheduleApi } from '../api/Fetch'
import date_picker from '../assets/date-picker.png'
import DatePicker from "react-multi-date-picker";

export default function SchedulePicker({ onDateChange }) {
  const [value, setValue] = useState(new Date());
  const [scheduleDates, setScheduleDates] = useState([]);
  const datePickerRef = useRef();

  useEffect(() => {
    if (onDateChange) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      onDateChange(dateStr);
    }
  }, []);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const schedules = await scheduleApi.getAllSchedules();
        const dates = schedules.map(schedule => schedule.screening_date);
        console.log('Loaded schedule dates:', dates);
        const uniqueDates = [...new Set(dates)];
        setScheduleDates(uniqueDates);
      } catch (error) {
        console.error('Failed to load schedules:', error);
      }
    };

    loadSchedules();
  }, []);

  const mapDays = ({ date }) => {
    // YYYY-MM-DD format
    const year = date.year;
    const month = String(date.month.number).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const hasSchedule = scheduleDates.includes(dateStr);
    console.log('Checking date:', dateStr, 'Has schedule:', hasSchedule, 'Available dates:', scheduleDates);
    
    if (hasSchedule) {
      return {
        style: { 
          backgroundColor: "#caf9ff",
          color: "#000",
          fontWeight: "bold"
        }
      };
    }
  };

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (datePickerRef.current) {
      datePickerRef.current.closeCalendar();
    }
    
    if (onDateChange && newValue) {
      const date = newValue.toDate ? newValue.toDate() : newValue;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      onDateChange(dateStr);
    }
  };

  const handleButtonClick = () => {
    if (datePickerRef.current) {
      if (datePickerRef.current.isOpen) {
        datePickerRef.current.closeCalendar();
      } else {
        datePickerRef.current.openCalendar();
      }
    }
  };

  const formatDateDisplay = (date) => {
    if (!date) return 'Select a date';
    const d = date instanceof Date ? date : new Date(date);
    const options = { day: 'numeric', month: 'long' };
    // fi-FI for localization
    return d.toLocaleDateString('en-US', options);
  };

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img 
        src={date_picker} 
        className="date-picker" 
        onClick={handleButtonClick}
        style={{ cursor: 'pointer' }}
      />
      <div 
        className="date-display"
        onClick={handleButtonClick}
        style={{ cursor: 'pointer' }}
      >
        {formatDateDisplay(value)}
      </div>
      <div style={{ visibility: 'hidden', position: 'absolute', pointerEvents: 'none', top: 0 }}>
        <DatePicker 
          ref={datePickerRef}
          value={value} 
          onChange={handleDateChange}
          mapDays={mapDays}
          portal={false}
          containerClassName="schedule-picker-container"
        />
      </div>
    </div>
  );
}