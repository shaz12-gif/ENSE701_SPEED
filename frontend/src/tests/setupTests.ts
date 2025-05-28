import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  // Clean up after each test
  cleanup();
  jest.clearAllMocks();
});