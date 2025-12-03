import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentForm } from '../features/payment/components/PaymentForm';
import React from 'react';

// Mock lottie-web to avoid canvas errors in jsdom
vi.mock('lottie-web', () => ({
  default: {
    loadAnimation: vi.fn(() => ({
      play: vi.fn(),
      stop: vi.fn(),
      destroy: vi.fn(),
    })),
  },
}));

describe('PaymentForm Component', () => {
  const defaultProps = {
    inputValue: '',
    setInputValue: vi.fn(),
    inputMode: 'USD' as const,
    setInputMode: vi.fn(),
    tokenSymbol: 'SOL',
    usdAmount: 0,
    tokenAmount: 0,
    message: '',
    setMessage: vi.fn(),
    link: '',
    setLink: vi.fn(),
  };

  it('renders correctly with empty inputs', () => {
    render(<PaymentForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('0.00')).toBeDefined();
    expect(screen.getByPlaceholderText('Declare your glory...')).toBeDefined();
    expect(screen.getByPlaceholderText('https://twitter.com/...')).toBeDefined();
  });

  it('handles input changes', () => {
    render(<PaymentForm {...defaultProps} />);
    
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '100' } });
    expect(defaultProps.setInputValue).toHaveBeenCalledWith('100');

    const messageInput = screen.getByPlaceholderText('Declare your glory...');
    fireEvent.change(messageInput, { target: { value: 'Hello World' } });
    expect(defaultProps.setMessage).toHaveBeenCalledWith('Hello World');
  });

  it('toggles input mode', () => {
    render(<PaymentForm {...defaultProps} />);
    
    const tokenButton = screen.getByText('SOL');
    fireEvent.click(tokenButton);
    expect(defaultProps.setInputMode).toHaveBeenCalledWith('TOKEN');
  });
});
