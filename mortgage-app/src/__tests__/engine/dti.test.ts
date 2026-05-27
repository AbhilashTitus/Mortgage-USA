import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import { calculateGrossMonthlyIncome, calculateNetMonthlyIncome, calculateTotalMonthlyDebts, calculateMaxHousingPayment } from '@/lib/engine/dti';
import { UserInputs } from '@/lib/engine/types';

describe('DTI Calculations', () => {
  const mockInputs: UserInputs = {
    yearlyGrossIncome: new Decimal(120000), // $10,000/mo
    coBorrowerIncome: new Decimal(60000),   // $5,000/mo
    borrowerDebts: [new Decimal(500), new Decimal(200)], // $700
    coBorrowerDebts: [new Decimal(300)],                // $300 -> Total $1000
    incomeTaxRate: new Decimal(0.30),       // 30%
    availableFunds: new Decimal(100000),
    creditScore: 750,
  };

  it('calculates gross monthly income correctly', () => {
    const grossMonthly = calculateGrossMonthlyIncome(mockInputs);
    expect(grossMonthly.toNumber()).toBe(15000); // (120k + 60k) / 12
  });

  it('calculates net monthly income correctly', () => {
    const netMonthly = calculateNetMonthlyIncome(mockInputs);
    // 15000 * (1 - 0.3) = 15000 * 0.7 = 10500
    expect(netMonthly.toNumber()).toBe(10500);
  });

  it('calculates total monthly debts correctly', () => {
    const totalDebts = calculateTotalMonthlyDebts(mockInputs);
    expect(totalDebts.toNumber()).toBe(1000);
  });

  it('calculates max housing payment bounded by front-end ratio', () => {
    // Front-end: 28% of 15000 = 4200
    // Back-end: 45% of 15000 = 6750. 6750 - 1000 = 5750
    // Front-end is smaller (4200)
    const frontEnd = new Decimal(0.28);
    const backEnd = new Decimal(0.45);

    const result = calculateMaxHousingPayment(mockInputs, frontEnd, backEnd);
    expect(result.frontEndLimit.toNumber()).toBe(4200);
    expect(result.backEndLimit.toNumber()).toBe(5750);
    expect(result.maxHousingPayment.toNumber()).toBe(4200);
  });

  it('calculates max housing payment bounded by back-end ratio', () => {
    // High debts scenario
    const inputsWithHighDebt = {
      ...mockInputs,
      borrowerDebts: [new Decimal(4000)], // $4000
    };
    
    // Front-end: 28% of 15000 = 4200
    // Back-end: 36% of 15000 = 5400. 5400 - 4300 (4000+300) = 1100
    // Back-end is smaller (1100)
    const frontEnd = new Decimal(0.28);
    const backEnd = new Decimal(0.36);

    const result = calculateMaxHousingPayment(inputsWithHighDebt, frontEnd, backEnd);
    expect(result.frontEndLimit.toNumber()).toBe(4200);
    expect(result.backEndLimit.toNumber()).toBe(1100);
    expect(result.maxHousingPayment.toNumber()).toBe(1100);
  });
});
