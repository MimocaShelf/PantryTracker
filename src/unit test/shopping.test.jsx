import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShoppingList from '../shoppingList.jsx';
import { vi, describe, it, beforeEach, expect } from 'vitest';

// Mock useNavigate from react-router-dom
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]),
        ok: true,
    })
);

describe('ShoppingList', () => {
    beforeEach(() => {
        fetch.mockClear();
        localStorage.clear();
    });

    it('renders the Shopping List heading', () => {
        render(<ShoppingList />);
        expect(screen.getByText(/Shopping List/i)).toBeInTheDocument();
    });

    it('renders input fields and add button', () => {
        render(<ShoppingList />);
        expect(screen.getByPlaceholderText(/Item name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Quantity/i)).toBeInTheDocument();
        expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
    });

    it('calls backend to add item and refreshes list', async () => {
        // Mock fetch for add and refresh
        fetch
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
            ) // getShoppingList on mount
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true }) // addShoppingListItem
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ name: 'Apple', quantity: 2 }]),
                })
            ); // getShoppingList after add

        render(<ShoppingList />);
        fireEvent.change(screen.getByPlaceholderText(/Item name/i), {
            target: { value: 'Apple' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Quantity/i), {
            target: { value: 2 },
        });
        fireEvent.click(screen.getByText(/Add Item/i));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:3001/addShoppingListItem',
                expect.objectContaining({
                    method: 'POST',
                })
            );
            expect(screen.getByText(/Apple/i)).toBeInTheDocument();
        });
    });

    it('does not add item if input is empty', async () => {
        render(<ShoppingList />);
        fireEvent.change(screen.getByPlaceholderText(/Item name/i), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText(/Add Item/i));
        // Should not call fetch for addShoppingListItem
        expect(fetch).toHaveBeenCalledTimes(1); // Only initial getShoppingList
    });

    it('removes an item from the list', async () => {
        // Mock fetch for initial list and remove
        fetch
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ name: 'Banana', quantity: 1 }]),
                })
            ) // getShoppingList on mount
            .mockImplementationOnce(() =>
                Promise.resolve({ ok: true }) // removeShoppingListItem
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([]),
                })
            ); // getShoppingList after remove

        render(<ShoppingList />);
        await waitFor(() => {
            expect(screen.getByText(/Banana/i)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Remove/i));
        await waitFor(() => {
            expect(screen.queryByText(/Banana/i)).not.toBeInTheDocument();
        });
    });

    it('increases and decreases item quantity', async () => {
        // Mock fetch for initial list, update, and refresh
        fetch
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ name: 'Carrot', quantity: 2 }]),
                })
            ) // getShoppingList on mount
            .mockImplementation(() =>
                Promise.resolve({ ok: true })
            ); // updateShoppingListItem and getShoppingList

        render(<ShoppingList />);
        await waitFor(() => {
            expect(screen.getByText(/Carrot/i)).toBeInTheDocument();
        });

        // Increase
        fireEvent.click(screen.getAllByText('+')[0]);
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:3001/updateShoppingListItem',
                expect.objectContaining({
                    method: 'POST',
                })
            );
        });

        // Decrease
        fireEvent.click(screen.getAllByText('-')[0]);
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:3001/updateShoppingListItem',
                expect.objectContaining({
                    method: 'POST',
                })
            );
        });
    });

    it('shows low stock recommendations', async () => {
        // Mock fetch for shopping list and low stock
        fetch
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([]),
                })
            ) // getShoppingList on mount
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve([
                            { item_name: 'Eggs', quantity: 1 },
                        ]),
                })
            ); // getLowStockItems

        render(<ShoppingList />);
        await waitFor(() => {
            expect(screen.getByText(/Eggs/i)).toBeInTheDocument();
            expect(screen.getByText(/Add to List/i)).toBeInTheDocument();
        });
    });
});