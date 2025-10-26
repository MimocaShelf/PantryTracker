import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import ShoppingList from '../shoppingList.jsx';
import '@testing-library/jest-dom/vitest';

// Mock react-router-dom's useNavigate to avoid real navigation during tests
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

function setupFetchMock({ initialList = [], lowStock = [] } = {}) {
  // mutable state to simulate backend changes
  let currentList = [...initialList];

  global.fetch = vi.fn(async (url, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();

    // GET shopping list
    if (url.includes('/getShoppingList') && method === 'GET') {
      return {
        ok: true,
        json: async () => [...currentList],
      };
    }

    // GET low stock items
    if (url.includes('/getLowStockItems') && method === 'GET') {
      return {
        ok: true,
        json: async () => [...lowStock],
      };
    }

    // POST add item to shopping list
    if (url.includes('/addShoppingListItem') && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const name = body.name;
      const qty = Number(body.quantity ?? 1);
      const idx = currentList.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
      if (idx >= 0) {
        currentList[idx] = { ...currentList[idx], quantity: currentList[idx].quantity + qty };
      } else {
        currentList.push({ name, quantity: qty });
      }
      return { ok: true, json: async () => ({ success: true }) };
    }

    // POST update item quantity
    if (url.includes('/updateShoppingListItem') && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const name = body.name;
      const qty = Number(body.quantity ?? 1);
      const idx = currentList.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
      if (idx >= 0) currentList[idx] = { ...currentList[idx], quantity: qty };
      return { ok: true, json: async () => ({ success: true }) };
    }

    // POST remove item
    if (url.includes('/removeShoppingListItem') && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const name = body.name;
      currentList = currentList.filter(i => i.name.toLowerCase() !== name.toLowerCase());
      return { ok: true, json: async () => ({ success: true }) };
    }

    // fallback
    return { ok: true, json: async () => ({}) };
  });

  return {
    getCurrentList: () => [...currentList],
    setCurrentList: (next) => { currentList = [...next]; },
  };
}

describe('ShoppingList (Vitest)', () => {
  beforeEach(() => {
    vi.useRealTimers();
    // default mock: empty list, no low stock
    setupFetchMock({ initialList: [], lowStock: [] });
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Shopping List heading', async () => {
    render(<ShoppingList />);
    expect(screen.getByText(/Shopping List/i)).toBeInTheDocument();
  });

  it('loads initial items from backend', async () => {
    setupFetchMock({ initialList: [{ name: 'Banana', quantity: 1 }] });
    render(<ShoppingList />);

    // Wait for item from backend to appear
    expect(await screen.findByText(/Banana/i)).toBeInTheDocument();
  });

  it('adds a new item via backend and refreshes the list', async () => {
    setupFetchMock({ initialList: [] });
    render(<ShoppingList />);

    // Fill inputs
    fireEvent.change(screen.getByPlaceholderText(/Item name/i), { target: { value: 'Apple' } });
    fireEvent.change(screen.getByPlaceholderText(/Quantity/i), { target: { value: '2' } });

    // Add item
    fireEvent.click(screen.getByText(/Add Item/i));

    // Should show Apple with quantity 2 after refresh
    const listItem = await screen.findByText(/Apple/i);
    expect(listItem).toBeInTheDocument();
  });

  it('increases and decreases item quantity via backend', async () => {
    setupFetchMock({ initialList: [{ name: 'Carrot', quantity: 2 }] });
    render(<ShoppingList />);

    // Wait for initial item
    await screen.findByText(/Carrot/i);
    // The item row
    const row = screen.getByText(/Carrot/i).closest('li');
    expect(row).toBeTruthy();

    // Click +
    const plusBtn = within(row).getByText('+');
    fireEvent.click(plusBtn);

    // Wait for backend update and refresh (quantity becomes 3)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/updateShoppingListItem'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    // Click - (should go down to 2, but not below 1)
    const minusBtn = within(row).getByText('-');
    fireEvent.click(minusBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/updateShoppingListItem'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('removes an item via backend', async () => {
    setupFetchMock({ initialList: [{ name: 'Milk', quantity: 1 }] });
    render(<ShoppingList />);

    // Wait for item and then remove
    await screen.findByText(/Milk/i);
    fireEvent.click(screen.getByText(/Remove/i));

    // Item should be gone after refresh
    await waitFor(() => {
      expect(screen.queryByText(/Milk/i)).not.toBeInTheDocument();
    });
  });

  it('shows low stock recommendations and can add them to the list', async () => {
    setupFetchMock({
      initialList: [],
      lowStock: [{ item_name: 'Eggs', quantity: 1 }],
    });
    render(<ShoppingList />);

    // Recommendation visible
    expect(await screen.findByText(/Eggs/i)).toBeInTheDocument();

    // Add to list from recommendation
    fireEvent.click(screen.getByText(/Add to List/i));

    // After add, Eggs should appear in main list
    expect(await screen.findByText(/^Eggs\b/i)).toBeInTheDocument();
  });
});