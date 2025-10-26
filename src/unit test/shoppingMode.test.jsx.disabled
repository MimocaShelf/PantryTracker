import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import ShoppingMode from '../shoppingMode.jsx';
import '@testing-library/jest-dom/vitest';

function setupFetchMock({ pantries = [], addItemOk = true } = {}) {
  const calls = { addItemBodies: [], removeCalls: 0 };

  global.fetch = vi.fn(async (url, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();

    // Load pantries for user
    if (url.includes('/postGetPantriesForUser') && method === 'POST') {
      return {
        ok: true,
        json: async () => pantries,
      };
    }

    // Add item to pantry
    if (url.includes('/postAddItemToPantry') && method === 'POST') {
      calls.addItemBodies.push(JSON.parse(options.body));
      return { ok: addItemOk, json: async () => ({}) };
    }

    // Remove from shopping list after sync
    if (url.includes('/removeShoppingListItem') && method === 'POST') {
      calls.removeCalls += 1;
      return { ok: true, json: async () => ({ success: true }) };
    }

    return { ok: true, json: async () => ({}) };
  });

  return calls;
}

describe('ShoppingMode pantry selection and sync', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    // simulate a logged-in user id
    localStorage.setItem('user_id', '42');
    // seed shopping list
    localStorage.setItem('shoppingList', JSON.stringify([
      { name: 'Apples', quantity: 3 },
      { name: 'Bread', quantity: 1 },
    ]));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads pantries, allows selecting one, and syncs bought items to selected pantry', async () => {
    const calls = setupFetchMock({
      pantries: [
        { pantry_id: 10, pantry_name: 'Kitchen' },
        { pantry_id: 11, pantry_name: 'Garage' },
      ],
    });

    render(<ShoppingMode />);

    // Wait for dropdown to be populated with first pantry selected
    const select = await screen.findByTestId('pantry-select');
    expect(select).toBeEnabled();
    expect(select).toHaveValue('10');

    // Mark first item as bought
    const markButtons = await screen.findAllByText(/Mark as Bought/i);
    expect(markButtons.length).toBeGreaterThan(0);
    fireEvent.click(markButtons[0]);

    // Click sync
    const syncBtn = screen.getByRole('button', { name: /Add Bought Items to Pantry/i });
    expect(syncBtn).toBeEnabled();
    fireEvent.click(syncBtn);

    // Verify POST used selected pantry_id 10
    await waitFor(() => {
      expect(calls.addItemBodies.length).toBeGreaterThan(0);
      expect(calls.addItemBodies[0].pantry_id).toBe(10);
    });
  });

  it('uses newly selected pantry when user changes dropdown', async () => {
    const calls = setupFetchMock({
      pantries: [
        { pantry_id: 1, pantry_name: 'Main' },
        { pantry_id: 2, pantry_name: 'Backup' },
      ],
    });

    render(<ShoppingMode />);

    const select = await screen.findByTestId('pantry-select');
    // Change to pantry id 2
    fireEvent.change(select, { target: { value: '2' } });

    // Mark one item as bought and sync
    const markButtons = await screen.findAllByText(/Mark as Bought/i);
    fireEvent.click(markButtons[0]);
    const syncBtn = screen.getByRole('button', { name: /Add Bought Items to Pantry/i });
    fireEvent.click(syncBtn);

    await waitFor(() => {
      expect(calls.addItemBodies.length).toBeGreaterThan(0);
      expect(calls.addItemBodies[0].pantry_id).toBe(2);
    });
  });

  it('disables sync and shows message when no pantry is available', async () => {
    setupFetchMock({ pantries: [] });

    render(<ShoppingMode />);

    const select = await screen.findByTestId('pantry-select');
    expect(select).toBeDisabled();

    // Mark item as bought
    const markButtons = await screen.findAllByText(/Mark as Bought/i);
    fireEvent.click(markButtons[0]);

    const syncBtn = screen.getByRole('button', { name: /Add Bought Items to Pantry/i });
    expect(syncBtn).toBeDisabled();
  });
});
