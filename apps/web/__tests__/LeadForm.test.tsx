import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the submitLead function
jest.mock('@/lib/api', () => ({
  submitLead: jest.fn(),
}));

import { LeadForm } from '@/components/LeadForm';
import { submitLead } from '@/lib/api';

const mockSubmitLead = submitLead as jest.MockedFunction<typeof submitLead>;

describe('LeadForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubmitLead.mockResolvedValue({ id: 'test-id', success: true });
  });

  it('renders all required fields', () => {
    render(<LeadForm lang="ua" />);
    expect(screen.getByPlaceholderText("Ваше ім'я")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+380 XX XXX XX XX')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Надіслати заявку' })).toBeInTheDocument();
  });

  it('renders in EN language', () => {
    render(<LeadForm lang="en" />);
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Request' })).toBeInTheDocument();
  });

  it('shows validation error when consent is not checked', async () => {
    render(<LeadForm lang="ua" />);
    fireEvent.change(screen.getByPlaceholderText("Ваше ім'я"), { target: { value: 'Іван' } });
    fireEvent.change(screen.getByPlaceholderText('+380 XX XXX XX XX'), { target: { value: '+380991234567' } });
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }));
    expect(screen.getByText('Необхідно погодитися з обробкою даних')).toBeInTheDocument();
    expect(mockSubmitLead).not.toHaveBeenCalled();
  });

  it('shows success message after valid submission', async () => {
    render(<LeadForm lang="ua" />);
    fireEvent.change(screen.getByPlaceholderText("Ваше ім'я"), { target: { value: 'Іван' } });
    fireEvent.change(screen.getByPlaceholderText('+380 XX XXX XX XX'), { target: { value: '+380991234567' } });
    fireEvent.click(screen.getByLabelText(/погоджуюся/i));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }));
    });
    await waitFor(() => {
      expect(screen.getByText('Заявку надіслано!')).toBeInTheDocument();
    });
    expect(mockSubmitLead).toHaveBeenCalledWith(expect.objectContaining({
      type: 'request',
      name: 'Іван',
      phone: '+380991234567',
      consent: true,
    }));
  });

  it('submits with type=request', async () => {
    render(<LeadForm lang="ua" />);
    fireEvent.change(screen.getByPlaceholderText("Ваше ім'я"), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('+380 XX XXX XX XX'), { target: { value: '+380991234567' } });
    fireEvent.click(screen.getByLabelText(/погоджуюся/i));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }));
    });
    expect(mockSubmitLead).toHaveBeenCalledWith(expect.objectContaining({ type: 'request' }));
  });

  it('shows API error message when submission fails', async () => {
    mockSubmitLead.mockRejectedValueOnce(new Error('Server error'));
    render(<LeadForm lang="ua" />);
    fireEvent.change(screen.getByPlaceholderText("Ваше ім'я"), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('+380 XX XXX XX XX'), { target: { value: '+380991234567' } });
    fireEvent.click(screen.getByLabelText(/погоджуюся/i));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }));
    });
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('disables submit button while loading', async () => {
    let resolveSubmit: () => void;
    mockSubmitLead.mockReturnValue(new Promise((res) => { resolveSubmit = () => res({ id: '1', success: true }); }));
    render(<LeadForm lang="ua" />);
    fireEvent.change(screen.getByPlaceholderText("Ваше ім'я"), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('+380 XX XXX XX XX'), { target: { value: '+380991234567' } });
    fireEvent.click(screen.getByLabelText(/погоджуюся/i));
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Надіслати заявку' }));
    });
    expect(screen.getByRole('button', { name: '...' })).toBeDisabled();
    await act(async () => { resolveSubmit!(); });
  });
});
