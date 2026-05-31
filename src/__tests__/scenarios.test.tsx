import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Decimal from 'decimal.js';
import { useAppStore } from '@/lib/store';
import { calculateAllRiskTiers } from '@/lib/engine/risk-tiers';
import { calculateAffordabilityTheories } from '@/lib/engine/theories';
import { calculatePriceComparisons } from '@/lib/engine/price-comparison';
import { calculateOtherCosts } from '@/lib/engine/other-costs';
import { CompactLivePreview } from '@/components/layout/AppSidebar';
import { UserInputs, DashboardSettings } from '@/lib/engine/types';
import scenariosFull from './fixtures/scenarios-full.json';

const initialState = useAppStore.getState();

function decimalToNumber(obj: any): any {
  if (obj instanceof Decimal) {
    return obj.toNumber();
  }
  if (Array.isArray(obj)) {
    return obj.map(decimalToNumber);
  }
  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = decimalToNumber(obj[key]);
    }
    return result;
  }
  return obj;
}

describe('Integration: 6 Real-Life Scenarios (Deep Dive & Theories)', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    useAppStore.getState().resetToDefaults();
  });

  scenariosFull.forEach((fixture: any) => {
    describe(fixture.scenario, () => {
      it('calculates ALL risk tiers perfectly without any discrepancy', () => {
        const engineInputs: UserInputs = {
          ...fixture.inputs,
          yearlyGrossIncome: new Decimal(fixture.inputs.yearlyGrossIncome),
          coBorrowerIncome: new Decimal(fixture.inputs.coBorrowerIncome),
          borrowerDebts: fixture.inputs.borrowerDebts.map((d: any) => new Decimal(d)),
          coBorrowerDebts: fixture.inputs.coBorrowerDebts.map((d: any) => new Decimal(d)),
          incomeTaxRate: new Decimal(fixture.inputs.incomeTaxRate).div(100),
          downPaymentPercent: new Decimal(fixture.inputs.downPaymentPercent).div(100),
          interestRate: new Decimal(fixture.inputs.interestRate).div(100),
          propertyTaxRate: new Decimal(fixture.inputs.propertyTaxRate).mul(100),
          insuranceRate: new Decimal(fixture.inputs.insuranceRate).mul(100),
          yearlyHOA: new Decimal(fixture.inputs.yearlyHOA),
        };

        const tiers = calculateAllRiskTiers(engineInputs);
        expect(decimalToNumber(tiers)).toEqual(fixture.outputs.tiers);
      });

      it('calculates ALL affordability theories (Dave Ramsey, QM, 2.6, 30-30-3) perfectly', () => {
        const engineInputs: UserInputs = {
          ...fixture.inputs,
          yearlyGrossIncome: new Decimal(fixture.inputs.yearlyGrossIncome),
          coBorrowerIncome: new Decimal(fixture.inputs.coBorrowerIncome),
          borrowerDebts: fixture.inputs.borrowerDebts.map((d: any) => new Decimal(d)),
          coBorrowerDebts: fixture.inputs.coBorrowerDebts.map((d: any) => new Decimal(d)),
          incomeTaxRate: new Decimal(fixture.inputs.incomeTaxRate).div(100),
          downPaymentPercent: new Decimal(fixture.inputs.downPaymentPercent).div(100),
          interestRate: new Decimal(fixture.inputs.interestRate).div(100),
          propertyTaxRate: new Decimal(fixture.inputs.propertyTaxRate).mul(100),
          insuranceRate: new Decimal(fixture.inputs.insuranceRate).mul(100),
          yearlyHOA: new Decimal(fixture.inputs.yearlyHOA),
        };

        const theories = calculateAffordabilityTheories(engineInputs);
        expect(decimalToNumber(theories)).toEqual(fixture.outputs.theories);
      });

      it('calculates deep dive data (Price Comparisons & Other Costs) perfectly', () => {
        const engineInputs: UserInputs = {
          ...fixture.inputs,
          yearlyGrossIncome: new Decimal(fixture.inputs.yearlyGrossIncome),
          coBorrowerIncome: new Decimal(fixture.inputs.coBorrowerIncome),
          borrowerDebts: fixture.inputs.borrowerDebts.map((d: any) => new Decimal(d)),
          coBorrowerDebts: fixture.inputs.coBorrowerDebts.map((d: any) => new Decimal(d)),
          incomeTaxRate: new Decimal(fixture.inputs.incomeTaxRate).div(100),
          downPaymentPercent: new Decimal(fixture.inputs.downPaymentPercent).div(100),
          interestRate: new Decimal(fixture.inputs.interestRate).div(100),
          propertyTaxRate: new Decimal(fixture.inputs.propertyTaxRate).mul(100),
          insuranceRate: new Decimal(fixture.inputs.insuranceRate).mul(100),
          yearlyHOA: new Decimal(fixture.inputs.yearlyHOA),
        };

        const tiers = calculateAllRiskTiers(engineInputs);
        const moderate = tiers.find(t => t.tier === 'Moderate');
        
        const defaultSettings: DashboardSettings = {
          selectedRiskTier: 'Moderate',
          estimatedSqFt: 2000,
          utilityLevel: 'Moderate',
          maintenanceLevel: 'Moderate',
          closingCostOption: '2.5% of Price (Typical)',
          customPrice: new Decimal(0),
        };

        const priceComparisons = calculatePriceComparisons(moderate!.maxPurchasePrice, moderate!.monthlyPayment.total, engineInputs, defaultSettings);
        const otherCosts = calculateOtherCosts(engineInputs, defaultSettings, moderate!.maxPurchasePrice, moderate!.monthlyPayment.total);

        expect(decimalToNumber(priceComparisons)).toEqual(fixture.outputs.priceComparisons);
        expect(decimalToNumber(otherCosts)).toEqual(fixture.outputs.otherCosts);
      });

      it('syncs the global store correctly with the Quick Info view panel', () => {
        // Sync to Zustand Store
        useAppStore.getState().updateUserInputs({
          yearlyGrossIncome: fixture.inputs.yearlyGrossIncome,
          coBorrowerIncome: fixture.inputs.coBorrowerIncome,
          borrowerDebts: fixture.inputs.borrowerDebts.map((d: any) => ({ name: 'Debt', amount: d })),
          coBorrowerDebts: fixture.inputs.coBorrowerDebts.map((d: any) => ({ name: 'Debt', amount: d })),
          incomeTaxRate: fixture.inputs.incomeTaxRate,
          downPaymentPercent: fixture.inputs.downPaymentPercent,
          interestRate: fixture.inputs.interestRate,
          propertyTaxRate: fixture.inputs.propertyTaxRate,
          insuranceRate: fixture.inputs.insuranceRate,
          yearlyHOA: fixture.inputs.yearlyHOA,
          mortgageTermYears: fixture.inputs.mortgageTermYears,
          mortgageInsuranceType: fixture.inputs.mortgageInsuranceType
        });
        
        render(<CompactLivePreview />);
        
        const formattedIncome = `$${fixture.inputs.yearlyGrossIncome.toLocaleString("en-US")}/yr`;
        expect(screen.getByText(formattedIncome)).toBeInTheDocument();
        
        const formattedInterest = `${fixture.inputs.interestRate.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`;
        expect(screen.getByText(formattedInterest)).toBeInTheDocument();
        
        const formattedDown = `${fixture.inputs.downPaymentPercent.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`;
        expect(screen.getByText(formattedDown)).toBeInTheDocument();
      });
    });
  });
});
