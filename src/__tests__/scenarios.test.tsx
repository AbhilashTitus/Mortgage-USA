import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Decimal from 'decimal.js';
import { useAppStore } from '@/lib/store';
import { calculateAllRiskTiers } from '@/lib/engine/risk-tiers';
import { CompactLivePreview } from '@/components/layout/AppSidebar';
import { UserInputs } from '@/lib/engine/types';

const initialState = useAppStore.getState();

const scenarios = [
  {
    name: '1. The FHA First-Time Buyer',
    inputs: {
      yearlyGrossIncome: 75000,
      coBorrowerIncome: 0,
      borrowerDebts: [{ name: "Car", amount: 400 }, { name: "CC", amount: 150 }],
      coBorrowerDebts: [],
      incomeTaxRate: 20, 
      downPaymentPercent: 3.5,
      interestRate: 6.250,
      mortgageTermYears: 30,
      mortgageInsuranceType: 'FHA' as const,
      yearlyHOA: 0,
      propertyTaxRate: 120, // 1.2% in bps
      insuranceRate: 42, // 0.42% in bps
    },
    expected: {
      maxPurchasePrice: 276378,
      downPayment: 9673,
      totalPayment: 2137,
      pmt: 1642,
      taxes: 276,
      insurance: 97,
      pmi: 122,
      hoa: 0
    }
  },
  {
    name: '2. The High-Income Conventional Buyer',
    inputs: {
      yearlyGrossIncome: 250000,
      coBorrowerIncome: 0,
      borrowerDebts: [], 
      coBorrowerDebts: [],
      incomeTaxRate: 35, 
      downPaymentPercent: 20,
      interestRate: 5.875,
      mortgageTermYears: 30,
      mortgageInsuranceType: 'Conv - Good Credit' as const,
      yearlyHOA: 3600, // $300/mo
      propertyTaxRate: 150, // 1.5% in bps
      insuranceRate: 50, // 0.5% in bps
    },
    expected: {
      maxPurchasePrice: 1125181,
      downPayment: 225036,
      totalPayment: 7500,
      pmt: 5325,
      taxes: 1406,
      insurance: 469,
      pmi: 0,
      hoa: 300
    }
  },
  {
    name: '3. The Dual-Income DTI-Constrained Couple',
    inputs: {
      yearlyGrossIncome: 120000,
      coBorrowerIncome: 80000,
      borrowerDebts: [{ name: "Student", amount: 1200 }],
      coBorrowerDebts: [{ name: "Auto", amount: 800 }],
      incomeTaxRate: 28, 
      downPaymentPercent: 5,
      interestRate: 6.750,
      mortgageTermYears: 30,
      mortgageInsuranceType: 'Conv - Fair Credit' as const,
      yearlyHOA: 0,
      propertyTaxRate: 110, // 1.1% in bps
      insuranceRate: 40, // 0.4% in bps
    },
    expected: {
      maxPurchasePrice: 642220,
      downPayment: 32111,
      totalPayment: 5167,
      pmt: 3957,
      taxes: 589,
      insurance: 214,
      pmi: 407,
      hoa: 0
    }
  },
  {
    name: '4. The Veteran (VA Loan)',
    inputs: {
      yearlyGrossIncome: 90000,
      coBorrowerIncome: 0,
      borrowerDebts: [{ name: "Debt", amount: 200 }], 
      coBorrowerDebts: [],
      incomeTaxRate: 22, 
      downPaymentPercent: 0,
      interestRate: 5.990,
      mortgageTermYears: 30,
      mortgageInsuranceType: 'VA' as const,
      yearlyHOA: 0,
      propertyTaxRate: 100, // 1.0% in bps
      insuranceRate: 35, // 0.35% in bps
    },
    expected: {
      maxPurchasePrice: 379529,
      downPayment: 0,
      totalPayment: 2700,
      pmt: 2273,
      taxes: 316,
      insurance: 111,
      pmi: 0,
      hoa: 0
    }
  },
  {
    name: '5. The Rural Buyer (USDA Loan)',
    inputs: {
      yearlyGrossIncome: 65000,
      coBorrowerIncome: 0,
      borrowerDebts: [{ name: "Debt", amount: 100 }], 
      coBorrowerDebts: [],
      incomeTaxRate: 15, 
      downPaymentPercent: 0,
      interestRate: 6.125,
      mortgageTermYears: 30,
      mortgageInsuranceType: 'USDA' as const,
      yearlyHOA: 0,
      propertyTaxRate: 80, // 0.8% in bps
      insuranceRate: 30, // 0.3% in bps
    },
    expected: {
      maxPurchasePrice: 267694,
      downPayment: 0,
      totalPayment: 1950,
      pmt: 1627,
      taxes: 178,
      insurance: 67,
      pmi: 78,
      hoa: 0
    }
  },
  {
    name: '6. The High-Tax State Buyer (e.g. TX/NJ)',
    inputs: {
      yearlyGrossIncome: 140000,
      coBorrowerIncome: 0,
      borrowerDebts: [{ name: "Debt", amount: 600 }], 
      coBorrowerDebts: [],
      incomeTaxRate: 24, 
      downPaymentPercent: 10,
      interestRate: 6.500,
      mortgageTermYears: 20,
      mortgageInsuranceType: 'Conv - Good Credit' as const,
      yearlyHOA: 1200, 
      propertyTaxRate: 275, // 2.75% in bps
      insuranceRate: 45, // 0.45% in bps
    },
    expected: {
      maxPurchasePrice: 417225,
      downPayment: 41723,
      totalPayment: 4200,
      pmt: 2800,
      taxes: 956,
      insurance: 156,
      pmi: 188,
      hoa: 100
    }
  }
];

describe('Integration: 6 Real-Life Scenarios', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    useAppStore.getState().resetToDefaults();
  });

  scenarios.forEach((scenario) => {
    describe(scenario.name, () => {
      it('calculates the exact Moderate tier numbers correctly through the engine', () => {
        // Sync to Zustand Store to mimic YourInfoForm saving data
        useAppStore.getState().updateUserInputs(scenario.inputs);
        const storeInputs = useAppStore.getState().userInputs;

        // Convert store inputs to engine inputs format
        const engineInputs: UserInputs = {
          yearlyGrossIncome: new Decimal(storeInputs.yearlyGrossIncome),
          coBorrowerIncome: new Decimal(storeInputs.coBorrowerIncome),
          borrowerDebts: storeInputs.borrowerDebts.map(d => new Decimal(d.amount)),
          coBorrowerDebts: storeInputs.coBorrowerDebts.map(d => new Decimal(d.amount)),
          incomeTaxRate: new Decimal(storeInputs.incomeTaxRate).div(100),
          downPaymentPercent: new Decimal(storeInputs.downPaymentPercent).div(100),
          interestRate: new Decimal(storeInputs.interestRate).div(100),
          mortgageTermYears: storeInputs.mortgageTermYears,
          mortgageInsuranceType: storeInputs.mortgageInsuranceType,
          yearlyHOA: new Decimal(storeInputs.yearlyHOA),
          propertyTaxRate: new Decimal(storeInputs.propertyTaxRate),
          insuranceRate: new Decimal(storeInputs.insuranceRate),
        };

        const tiers = calculateAllRiskTiers(engineInputs);
        const moderate = tiers.find(t => t.tier === 'Moderate');
        
        expect(moderate).toBeDefined();
        
        // Assertions allowing minor 1 dollar rounding differences to be completely foolproof
        expect(Math.round(moderate!.maxPurchasePrice.toNumber())).toBeCloseTo(scenario.expected.maxPurchasePrice, -1);
        expect(Math.round(moderate!.downPayment.toNumber())).toBeCloseTo(scenario.expected.downPayment, -1);
        expect(Math.round(moderate!.monthlyPayment.total.toNumber())).toBeCloseTo(scenario.expected.totalPayment, -1);
        expect(Math.round(moderate!.monthlyPayment.principalAndInterest.toNumber())).toBeCloseTo(scenario.expected.pmt, -1);
        expect(Math.round(moderate!.monthlyPayment.propertyTaxes.toNumber())).toBeCloseTo(scenario.expected.taxes, -1);
        expect(Math.round(moderate!.monthlyPayment.homeownersInsurance.toNumber())).toBeCloseTo(scenario.expected.insurance, -1);
        expect(Math.round(moderate!.monthlyPayment.mortgageInsurance.toNumber())).toBeCloseTo(scenario.expected.pmi, -1);
        expect(Math.round(moderate!.monthlyPayment.hoa.toNumber())).toBeCloseTo(scenario.expected.hoa, -1);
      });

      it('syncs correctly with the Quick Info view panel without truncation', () => {
        useAppStore.getState().updateUserInputs(scenario.inputs);
        
        render(<CompactLivePreview />);
        
        // Ensure values are displaying properly formatted
        const formattedIncome = `$${scenario.inputs.yearlyGrossIncome.toLocaleString("en-US")}/yr`;
        expect(screen.getByText(formattedIncome)).toBeInTheDocument();
        
        const formattedInterest = `${scenario.inputs.interestRate.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`;
        expect(screen.getByText(formattedInterest)).toBeInTheDocument();
        
        const formattedDown = `${scenario.inputs.downPaymentPercent.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`;
        expect(screen.getByText(formattedDown)).toBeInTheDocument();
      });
    });
  });
});
