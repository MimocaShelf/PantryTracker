import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import '../pantry/addToPantry.jsx';
import '../pantry/getPantries.js';
import { getPantries } from '../pantry/getPantries.js';

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


describe('Testing getPantries', () => {
  it('should return json body of fetch request', () => {
    let json = getPantries(3);
    expect(json).toBe({})
  })
})