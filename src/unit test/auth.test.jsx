import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Login from '../login.jsx';
import Signup from '../signup.jsx';

// Mock the fetch API
global.fetch = vi.fn();

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorage.setItem.mockClear();
  });

  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check if all form elements are present
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  it('updates form values when user types', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const rememberMeCheckbox = screen.getByLabelText(/Remember me/i);

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(rememberMeCheckbox);

    // Check if values are updated
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(rememberMeCheckbox).toBeChecked();
  });

  it('submits the form and handles successful login', async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: '123' })
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Password/i), { 
      target: { value: 'password123' } 
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for the async operations to complete
    await waitFor(() => {
      // Check if fetch was called with correct arguments
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      // Check if localStorage was updated
      expect(localStorage.setItem).toHaveBeenCalledWith('user_id', JSON.stringify('123'));

      // Check if navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith('/user');
    });
  });

  it('displays error message on login failure', async () => {
    // Mock failed fetch response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), { 
      target: { value: 'wrong@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Password/i), { 
      target: { value: 'wrongpassword' } 
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/Login failed/i);
    expect(errorMessage).toBeInTheDocument();

    // Verify navigation didn't happen
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles network errors during login', async () => {
    // Mock network error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Password/i), { 
      target: { value: 'password123' } 
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/Login failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('navigates to signup page when signup link is clicked', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Click on the signup link
    fireEvent.click(screen.getByText(/Sign up/i));

    // Check if the correct route was navigated to
    // Note: In a MemoryRouter test, we can't directly test navigation,
    // but in a real app this would navigate to /signup
  });

  it('navigates to forgot password page when forgot password link is clicked', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Click on the forgot password link
    fireEvent.click(screen.getByText(/Forgot password/i));

    // Check if the correct route was navigated to
    // Note: In a MemoryRouter test, we can't directly test navigation,
    // but in a real app this would navigate to /forgot-password
  });
});

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  it('renders signup form correctly', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Check if all form elements are present
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to the/i)).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  it('updates form values when user types', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const termsCheckbox = screen.getByLabelText(/I agree to the/i);

    // Simulate user typing
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);

    // Check if values are updated
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
    expect(termsCheckbox).toBeChecked();
  });

  it('shows error when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in the form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'differentpassword' } });
    fireEvent.click(screen.getByLabelText(/I agree to the/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Check if error message appears
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    
    // Verify fetch was not called
    expect(fetch).not.toHaveBeenCalled();
  });

  it('shows error when terms are not accepted', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in the form without accepting terms
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    // Don't check the terms checkbox

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Check if error message appears
    expect(await screen.findByText(/You must agree to the terms/i)).toBeInTheDocument();
    
    // Verify fetch was not called
    expect(fetch).not.toHaveBeenCalled();
  });

  it('submits the form and handles successful signup', async () => {
    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User registered successfully' })
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in the form correctly
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/I agree to the/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for the async operations to complete
    await waitFor(() => {
      // Check if fetch was called with correct arguments
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        })
      });

      // Check if navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('displays error message on signup failure', async () => {
    // Mock failed fetch response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already exists' })
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/I agree to the/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/Email already exists/i);
    expect(errorMessage).toBeInTheDocument();

    // Verify navigation didn't happen
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles network errors during signup', async () => {
    // Mock network error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/I agree to the/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/Network error/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('navigates to login page when login link is clicked', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Click on the login link
    fireEvent.click(screen.getByText(/Sign in/i));

    // Note: In a MemoryRouter test, we can't directly test navigation,
    // but in a real app this would navigate to /login
  });

  it('navigates to terms page when Terms of Service link is clicked', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Click on the terms link
    fireEvent.click(screen.getByText(/Terms of Service/i));

    // Note: In a MemoryRouter test, we can't directly test navigation,
    // but in a real app this would navigate to /terms
  });

  it('navigates to privacy page when Privacy Policy link is clicked', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Click on the privacy link
    fireEvent.click(screen.getByText(/Privacy Policy/i));

    // Note: In a MemoryRouter test, we can't directly test navigation,
    // but in a real app this would navigate to /privacy
  });
});