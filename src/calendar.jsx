import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="calendar-page">
      <h2>My Calendar</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <p>Selected Date: {selectedDate.toDateString()}</p>
    </div>
  );
}

export default CalendarPage;