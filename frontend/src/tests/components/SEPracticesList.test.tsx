import React from 'react';
import { render, screen } from '@testing-library/react';
import SEPracticesList from '@/components/SEPracticesList';

describe('SEPracticesList', () => {
  const mockPractices = [
    { id: 1, name: 'TDD', description: 'Test-driven development' },
    { id: 2, name: 'CI', description: 'Continuous integration' }
  ];

  it('renders practices list', () => {
    render(<SEPracticesList practices={mockPractices} />);
    expect(screen.getByText('TDD')).toBeInTheDocument();
    expect(screen.getByText('CI')).toBeInTheDocument();
  });

  it('handles empty practices list', () => {
    render(<SEPracticesList practices={[]} />);
    expect(screen.getByText(/no practices/i)).toBeInTheDocument();
  });
});