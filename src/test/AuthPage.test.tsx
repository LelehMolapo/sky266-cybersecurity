import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthPage from '../components/AuthPage';

const mockOnLogin = vi.fn();
const mockOnSignUp = vi.fn();

describe('AuthPage', () => {
  it('renders login form', () => {
    render(<AuthPage onLogin={mockOnLogin} onSignUp={mockOnSignUp} />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@sky266.com')).toBeInTheDocument();
  });

  it('validates email format', () => {
    render(<AuthPage onLogin={mockOnLogin} onSignUp={mockOnSignUp} />);
    const emailInput = screen.getByPlaceholderText('name@sky266.com');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(emailInput).toHaveValue('invalid-email');
  });
});