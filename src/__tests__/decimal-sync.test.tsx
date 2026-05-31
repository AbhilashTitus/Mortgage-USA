import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAppStore } from '@/lib/store';
import { CompactLivePreview } from '@/components/layout/AppSidebar';
import { YourInfoForm } from '@/components/forms/YourInfoForm';
import { DashboardSettingsState, UserInputState } from '@/lib/schemas';

// Mock Zustand store state to ensure clean tests
const initialState = useAppStore.getState();

describe('Decimal Synchronization across Forms (TRID Regulations)', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    useAppStore.getState().resetToDefaults();
  });

  it('preserves up to 3 decimal places for interest rate in store', () => {
    const { updateUserInputs, userInputs } = useAppStore.getState();
    updateUserInputs({ interestRate: 6.125 });
    
    expect(useAppStore.getState().userInputs.interestRate).toBe(6.125);
  });

  it('preserves exact decimals when typing into CompactLivePreview inputs', async () => {
    render(<CompactLivePreview />);
    
    // Find the Interest Rate preview text (it's formatted)
    // Initially interest rate is 6.5%
    const interestSpan = screen.getByText('6.5%');
    expect(interestSpan).toBeInTheDocument();

    // Click to enter edit mode
    await userEvent.click(interestSpan);

    // Now it should be an input field
    const inputs = screen.getAllByRole('spinbutton');
    // We assume the one with value 6.5 is our input
    const interestInput = inputs.find(input => (input as HTMLInputElement).value === '6.5');
    expect(interestInput).toBeDefined();

    // Type a precise TRID-compliant interest rate
    await userEvent.clear(interestInput!);
    await userEvent.type(interestInput!, '6.125');
    
    // Blur to trigger save
    fireEvent.blur(interestInput!);

    // Check the store directly
    expect(useAppStore.getState().userInputs.interestRate).toBe(6.125);

    // It should now display exactly 6.125%
    expect(screen.getByText('6.125%')).toBeInTheDocument();
  });

  it('syncs Down Payment decimal correctly between CompactLivePreview and store', async () => {
    render(<CompactLivePreview />);
    
    // Initially down payment is 20%
    const downPaymentSpan = screen.getByText('20%');
    await userEvent.click(downPaymentSpan);

    const inputs = screen.getAllByRole('spinbutton');
    const dpInput = inputs.find(input => (input as HTMLInputElement).value === '20');
    
    await userEvent.clear(dpInput!);
    await userEvent.type(dpInput!, '3.5'); // Common FHA down payment
    fireEvent.blur(dpInput!);

    expect(useAppStore.getState().userInputs.downPaymentPercent).toBe(3.5);
    expect(screen.getByText('3.5%')).toBeInTheDocument();
  });
  
  it('handles fine property tax decimals', () => {
    const { updateUserInputs } = useAppStore.getState();
    // Simulate setting 1.255% property tax rate 
    // In store it's maintained in basis points (val * 100) -> 125.5
    updateUserInputs({ propertyTaxRate: 125.5 });
    expect(useAppStore.getState().userInputs.propertyTaxRate).toBe(125.5);
  });
});
