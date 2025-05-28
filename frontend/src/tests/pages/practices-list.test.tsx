import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import PracticesPage from '@/app/practice/pages';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

describe('PracticesListPage', () => {
  const mockPractices = [
    { id: '1', name: 'Test-Driven Development', description: 'TDD practice', evidenceCount: 5 },
    { id: '2', name: 'Pair Programming', description: 'Pair programming practice', evidenceCount: 3 }
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockPractices })
      })
    ) as jest.Mock;
  });

  it('renders practices list', async () => {
    await act(async () => {
      render(<PracticesPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test-Driven Development')).toBeInTheDocument();
      expect(screen.getByText('Pair Programming')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    render(<PracticesPage />);
    expect(screen.getByText(/Loading practices/i)).toBeInTheDocument();
  });
});