import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalendarMealPlanner from '../calendar.jsx';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

//check if the calendar page renders
describe('CalendarMealPlanner Component', () => {
  beforeEach(() => {
    vi.useFakeTimers(); 
  });

  it('renders calendar and header text', () => {
    render(<CalendarMealPlanner />);
    expect(screen.getByText('Monthly Meal Planner')).toBeInTheDocument();
    expect(screen.getByText(/View your monthly calendar/)).toBeInTheDocument();
  });


});