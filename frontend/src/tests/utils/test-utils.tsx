import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock data
export const mockPractices = [
  { id: 1, name: 'Test-Driven Development', description: 'TDD practice' },
  { id: 2, name: 'Pair Programming', description: 'Pair programming practice' }
];

export const mockEvidence = [
  {
    _id: '1',
    practiceId: '1',
    title: 'TDD Evidence',
    source: 'Research Paper',
    year: 2023,
    description: 'Evidence supporting TDD'
  }
];

// Custom render function
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };