import { useState } from 'react'
import { scheduleApi } from '../api/Fetch'
import date_picker from '../assets/date-picker.png'

export default function SchedulePicker() {
  const scheduleId = 1;
  const theaterId = 1;
  const movieId = 1;

  return (
    <>
      <img src={date_picker} className="date-picker" />
      <div className="date-display">6th of November</div>
    </>
  );
}