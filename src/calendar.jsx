import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarMealPlanner() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [mealPlan, setMealPlan] = useState({});
  const [tempMeals, setTempMeals] = useState({ breakfast: "", lunch: "", dinner: "" });
  const [showModal, setShowModal] = useState(false);

  const slots = ["breakfast", "lunch", "dinner"];

  const formatKey = (date) => date.toISOString().split("T")[0];

  // Format for display (DD/MM/YYYY)
  const formatDisplayDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getWeekdayName = (date) => {
    return date.toLocaleDateString('en-AU', { weekday: 'long' });
  };

  // Open modal for selected date
  const openModalForDate = (date) => {
    const key = formatKey(date);
    setSelectedDate(date);
    setTempMeals(mealPlan[key] || { breakfast: "", lunch: "", dinner: "" });
    setShowModal(true);
  };

  // Save meals to mealPlan
  const handleSaveMeals = () => {
    const key = formatKey(selectedDate);
    setMealPlan(prev => ({
      ...prev,
      [key]: { ...tempMeals }
    }));
    setShowModal(false);
  };

  // Render each calendar tile
  const renderTileContent = ({ date }) => {
    const key = formatKey(date);
    const meals = mealPlan[key];

    return (
      <div className="tile-content">
        <div className="tile-date">{date.getDate()}</div>

        {meals && (
          <div className="tile-meals">
            {slots.map(slot => (
              meals[slot] ? (
                <div key={slot} className="tile-meal">
                  <strong>{slot.charAt(0).toUpperCase() + slot.slice(1)}:</strong> {meals[slot]}
                </div>
              ) : null
            ))}
          </div>
        )}

        <button
          className="tile-button"
          onClick={(e) => {
            e.stopPropagation(); 
            openModalForDate(date);
          }}
        >
          Plan Meal(s)
        </button>
      </div>
    );
  };

  return (
    <div className="calendar-wrapper">
      <h1>Monthly Meal Planner</h1>
       <p>View your monthly calendar and see what meals you've planned for each day!</p>
        <p>Click the "Plan Meals" button on any date to add, update or delete breakfast, lunch and/or dinner entries.</p>
      <Calendar
        onClickDay={setSelectedDate}
        tileContent={renderTileContent}
      />

      {showModal && selectedDate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              Meals for {getWeekdayName(selectedDate)} {formatDisplayDate(selectedDate)}
            </h2>
            {slots.map(slot => (
              <div key={slot} className="modal-slot">
                <label>{slot.charAt(0).toUpperCase() + slot.slice(1)}:</label>
                <input
                  type="text"
                  value={tempMeals[slot]}
                  onChange={(e) =>
                    setTempMeals(prev => ({ ...prev, [slot]: e.target.value }))
                  }
                  placeholder={`Enter ${slot} meal`}
                />
              </div>
            ))}
            <div className="modal-buttons">
              <button onClick={handleSaveMeals}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarMealPlanner;