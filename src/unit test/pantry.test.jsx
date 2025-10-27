import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Pantry from '../pantry.jsx';

describe('Pantry Feature Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  //filters pantries
  it('Filters pantry list based on search input', async () => {
    const mockPantries = [
      { pantry_id: 1, pantry_name: 'Fridge', pantry_owner: 'Maia', pantry_itemAmount: 5 },
      { pantry_id: 2, pantry_name: 'Freezer', pantry_owner: 'Maia', pantry_itemAmount: 3 }
    ];

    global.fetch = vi.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockPantries)
    }));

    render(<MemoryRouter><Pantry /></MemoryRouter>);

    fireEvent.change(await screen.findByPlaceholderText(/Search for Pantry/i), {
      target: { value: 'Freezer' }
    });

    expect(await screen.findByText(/Freezer/i)).toBeInTheDocument();
    expect(screen.queryByText(/Fridge/i)).not.toBeInTheDocument();
  });

  //drop down sort menu alphabetically
  it('Sorts pantries alphabetically', async () => {
    const mockPantries = [
      { pantry_id: 2, pantry_name: 'Zebra', pantry_owner: 'Maia', pantry_itemAmount: 1 },
      { pantry_id: 1, pantry_name: 'Apple', pantry_owner: 'Maia', pantry_itemAmount: 2 }
    ];

    global.fetch = vi.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockPantries)
    }));

    render(<MemoryRouter><Pantry /></MemoryRouter>);

    const cards = await screen.findAllByRole('heading', { level: 2 });
    expect(cards[0]).toHaveTextContent('Apple');
    expect(cards[1]).toHaveTextContent('Zebra');
  });
});