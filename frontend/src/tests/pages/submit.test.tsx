import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import SubmitEvidenceForm from '../../app/submit/page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe('SubmitEvidenceForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          success: true,
          data: [
            { id: 1, name: 'Test-Driven Development' },
            { id: 2, name: 'Pair Programming' }
          ]
        })
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields after loading', async () => {
    await act(async () => {
      render(<SubmitEvidenceForm />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading practices...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Use more specific selectors based on your actual form structure
    expect(screen.getByRole('combobox', { name: /practice/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /claim/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /source/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /year/i })).toBeInTheDocument();
  });

  it('updates form values when user types', async () => {
    await act(async () => {
      render(<SubmitEvidenceForm />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading practices...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const sourceInput = screen.getByRole('textbox', { name: /source/i });
    
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(sourceInput, { target: { value: 'Test Source' } });
    });
    
    expect(titleInput).toHaveValue('Test Title');
    expect(sourceInput).toHaveValue('Test Source');
  });

  it('handles form submission', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [{ id: 1, name: 'TDD' }] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

    await act(async () => {
      render(<SubmitEvidenceForm />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading practices...')).not.toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByLabelText(/practice/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/claim/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Evidence' } });
    fireEvent.change(screen.getByLabelText(/source/i), { target: { value: 'Test Source' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '2023' } });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit evidence/i }));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/practices');
    });
  });
});