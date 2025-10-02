import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import User from '../user.jsx';

// Mock fetch API
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('User Component', () => {
  const mockUserData = {
    name: 'John Doe',
    email: 'john@example.com',
    profilePicture: 'https://via.placeholder.com/150'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue('123'); // Default to having a user ID
  });

  it('shows loading state initially', () => {
    // Mock fetch to delay response
    fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading user data...')).toBeInTheDocument();
  });

  it('fetches and displays user data correctly', async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>
    );

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByAltText(`John Doe's profile`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();

    // Verify fetch was called with correct URL
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/123');
  });

  it('handles fetch error gracefully', async () => {
    // Mock failed fetch response
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>
    );

    // Should still show loading initially
    expect(screen.getByText('Loading user data...')).toBeInTheDocument();
  });

  it('handles case when no user is logged in', async () => {
    // Mock localStorage to return null (no user logged in)
    localStorage.getItem.mockReturnValue(null);

    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>
    );

    // Should show loading message initially
    expect(screen.getByText('Loading user data...')).toBeInTheDocument();

    // Should not attempt to fetch user data
    expect(fetch).not.toHaveBeenCalled();
  });

  it('switches to edit mode when Edit Profile button is clicked', async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>
    );

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click the Edit Profile button
    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));

    // Check if form fields appear
    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile Picture URL:')).toBeInTheDocument();
  });

  it('cancels editing when Cancel button is clicked', async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>
    );

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Click Edit Profile
    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
    
    // Click the Cancel button
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    
    // Check if we're back to display mode
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByLabelText('Name:')).not.toBeInTheDocument();
  });

  it('submits updated user data when Save Changes is clicked', async () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Mock successful fetch responses
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });
    
    // Mock the PUT request response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockUserData,
        name: 'Jane Smith'
      })
    });

    render(
      <MemoryRouter>
        <User />
      </MemoryRouter>
    );

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Click Edit Profile
    fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
    
    // Change name field
    fireEvent.change(screen.getByLabelText('Name:'), { 
      target: { value: 'Jane Smith' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    
    // Check if the PUT request was made
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/123', expect.any(Object));
    });
    
    // Clean up mock
    alertMock.mockRestore();
  });
});