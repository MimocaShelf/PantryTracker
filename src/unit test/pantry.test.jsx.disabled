import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Pantry from '../pantry.jsx';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

global.fetch = vi.fn();
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};

//dummy data for tests
const mockPantries = [
  { pantry_id: 1, pantry_name: 'Snacks', pantry_owner: 'Maia', pantry_itemAmount: 5 },
  { pantry_id: 2, pantry_name: 'Drinks', pantry_owner: 'Maia', pantry_itemAmount: 3 }
];


describe('Pantry Component', () => {
  beforeEach(() => {
    fetch.mockReset();
    localStorage.getItem.mockReset();
    localStorage.setItem.mockReset();
  });

  it('renders pantry list from backend', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPantries
    });

    render(<MemoryRouter><Pantry /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Snacks')).toBeInTheDocument();
      expect(screen.getByText('Drinks')).toBeInTheDocument();
    });
  });

  //filteringPantry
  it('filters pantries by search input', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPantries
    });

    render(<MemoryRouter><Pantry /></MemoryRouter>);
    await waitFor(() => screen.getByText('Snacks'));

    fireEvent.change(screen.getByPlaceholderText('Search for Pantry...'), {
      target: { value: 'Drink' }
    });

    expect(screen.queryByText('Snacks')).not.toBeInTheDocument();
    expect(screen.getByText('Drinks')).toBeInTheDocument();
  });

  //addPantry
  it('shows form and adds a new pantry', async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockPantries }) 
      .mockResolvedValueOnce({ ok: true, json: async () => ({ pantry_id: 3 }) }) 
      .mockResolvedValueOnce({ ok: true, json: async () => [...mockPantries, { pantry_id: 3, pantry_name: 'New Pantry', pantry_owner: 'Temporary Owner', pantry_itemAmount: 0 }] }); 

    render(<MemoryRouter><Pantry /></MemoryRouter>);
    fireEvent.click(screen.getByText('+ Create New Pantry'));

    fireEvent.change(screen.getByPlaceholderText('Pantry Name'), {
      target: { value: 'New Pantry' }
    });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(screen.getByText('Pantry "New Pantry" added!')).toBeInTheDocument();
      expect(screen.getByText('New Pantry')).toBeInTheDocument();
    });
  });

  //deletePantry
  it('deletes a pantry and shows confirmation', async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockPantries }) 
      .mockResolvedValueOnce({ ok: true }); 

    render(<MemoryRouter><Pantry /></MemoryRouter>);
    await waitFor(() => screen.getByText('Snacks'));

    fireEvent.click(screen.getAllByText('Delete')[1]);

    await waitFor(() => {
      expect(screen.queryByText('Snacks')).not.toBeInTheDocument();
      expect(screen.getByText('Pantry "Snacks" deleted!')).toBeInTheDocument();
    });
  });

  //sortingPantry
  it('sorts pantries alphabetically', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPantries
    });

    render(<MemoryRouter><Pantry /></MemoryRouter>);
    await waitFor(() => screen.getByText('Snacks'));

    fireEvent.change(screen.getByDisplayValue('Alphabetical'), {
      target: { value: 'Alphabetical' }
    });

    const pantryNames = screen.getAllByRole('heading', { level: 2 }).map(el => el.textContent);
    expect(pantryNames).toEqual(['Drinks', 'Snacks']);
  });
});