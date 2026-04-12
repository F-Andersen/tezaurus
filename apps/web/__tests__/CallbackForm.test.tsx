import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@/lib/api', () => ({
  submitLead: jest.fn(),
}));

import { CallbackForm } from '@/components/CallbackForm';
import { submitLead } from '@/lib/api';

const mockSubmitLead = submitLead as jest.MockedFunction<typeof submitLead>;

describe('CallbackForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubmitLead.mockResolvedValue({ id: 'test-id', success: true });
  });

  it('renders phone field and submit button in UA', () => {
    render(<CallbackForm lang="ua" />);
    expect(screen.getByPlaceholderText('+380 XX XXX XX XX')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Передзвоніть мені' })).toBeInTheDocument();
  });

  it('renders in EN language', () => {
    render(<CallbackForm lang="en" />);
    expect(screen.getByRole('button', { name: 'Call Me Back' })).toBeInTheDocument();
  });

  it('renders optional name field', () => {
    render(<CallbackForm lang="ua" />);
    expect(screen.getByPlaceholderText(/необов'язково/i)).toBeInTheDocument();
  });

  it('submits with type=callback and consent=true', async () => {
    render(<CallbackForm lang="ua" />);
    fireEvent.change(screen.getByPlaceholderText('+380 XX XXX XX XX'), { target: { value: '+380991234567' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Передзвоніть мені' }));
    });
    expect(mockSubmitLead).toHaveBeenCalledWith(expect.objectContaining({
      type: 'callback',
      phone: '+380991234567',
      consent: true,
    }));
  });

  it('includes name when provided', async () => {
    render(<CallbackForm lang="ua" />);
    fireEvent.change(screen.getByPlaceholderText('+380 XX XXX XX XX'), { target: { value: '+380991234567' } });
    fireEvent.change(screen.getByPlaceholderText(/необов'язково/i), { target: { value: 'Іван' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Передзвоніть мені' }));
    });
    expect(mockSubmitLead).toHaveBeenCalledWith(expect.objectContaining({ name: 'Іван' }));
  });

  it('shows success message after submission', async () => {
    render(<CallbackForm lang="ua" />);
    fireEvent.change(screen.getByPlaceholderText('+380 XX XXX XX XX'), { target: { value: '+380991234567' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Передзвоніть мені' }));
    });
    await waitFor(() => {
      expect(screen.getByText('Запит надіслано!')).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    mockSubmitLead.mockRejectedValueOnce(new Error('Network error'));
    render(<CallbackForm lang="ua" />);
    fireEvent.change(screen.getByPlaceholderText('+380 XX XXX XX XX'), { target: { value: '+380991234567' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Передзвоніть мені' }));
    });
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
