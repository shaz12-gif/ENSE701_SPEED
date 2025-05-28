import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

describe('HomePage', () => {
  it('renders main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<HomePage />);
    // Based on your actual home page content
    expect(screen.getByText(/Browse Practices/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Evidence/i)).toBeInTheDocument();
  });

  it('renders info cards', () => {
    render(<HomePage />);
    expect(screen.getByText(/For Researchers/i)).toBeInTheDocument();
    expect(screen.getByText(/For Practitioners/i)).toBeInTheDocument();
    expect(screen.getByText(/For Educators/i)).toBeInTheDocument();
  });
});