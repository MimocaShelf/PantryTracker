import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import {addItemDataValidation, editItemDataValidation} from '../../server/pantryValidation.js'

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


describe('Testing addItemDataValidation', () => {
  test('should return false when all fields are null', () => {
    let testFunc = addItemDataValidation(null, null,null,null,null)
    expect(testFunc).toBe(false);
  })
  test('should return false when pantry_id is null', () => {
    let testFunc = addItemDataValidation(null, 'Apple',null,5,'units')
    expect(testFunc).toBe(false);
  })
  test('should return false when item_name is null', () => {
    let testFunc = addItemDataValidation(1, null,null,5,'units')
    expect(testFunc).toBe(false);
  })
  test('should return false when unit is null', () => {
    let testFunc = addItemDataValidation(1, 'Apple',null,5,null)
    expect(testFunc).toBe(false);
  })
  test('should return true when all fields are valid', () => {
    let testFunc = addItemDataValidation(1, 'Apple',null,5,'units')
    expect(testFunc).toBe(true);
  })
})
describe('Testing editItemDataValidation', () => {
  test('should return false when all fields are null', () => {
    let testFunc = editItemDataValidation(null, null, null,null,null,null)
    expect(testFunc).toBe(false);
  })
  test('should return false when pantry_item_id is null', () => {
    let testFunc = editItemDataValidation(null, 1, 'Apple',null,5,'units')
    expect(testFunc).toBe(false);
  })
  test('should return false when pantry_id is null', () => {
    let testFunc = editItemDataValidation(1, null, 'Apple',null,5,'units')
    expect(testFunc).toBe(false);
  })
  test('should return false when item_name is null', () => {
    let testFunc = editItemDataValidation(1, 1, null,null,5,'units')
    expect(testFunc).toBe(false);
  })
  test('should return false when unit is null', () => {
    let testFunc = editItemDataValidation(1, 1, 'Apple',null,5,null)
    expect(testFunc).toBe(false);
  })
  test('should return true when all fields are valid', () => {
    let testFunc = editItemDataValidation(1, 1, 'Apple',null,5,'units')
    expect(testFunc).toBe(true);
  })
})