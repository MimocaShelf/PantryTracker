import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup DOM after each test
afterEach(() => {
  cleanup();
});

// Surface unhandled promise rejections as test failures
process.on('unhandledRejection', (reason) => {
  throw reason;
});

// Optional: mock CSS that breaks Node/jsdom in tests
vi.mock('react-calendar/dist/Calendar.css', () => ({}), { virtual: true });

// Optional: stub scrollTo to avoid errors in components that call it
if (!window.scrollTo) {
  window.scrollTo = vi.fn();
}
