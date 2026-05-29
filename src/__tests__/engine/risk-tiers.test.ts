import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import { getMortgageInsuranceRate, solveMaxPurchasePrice, calculateAllRiskTiers } from '@/lib/engine/risk-tiers';
import { UserInputs } from '@/lib/engine/types';

describe('Risk Tiers & Solver', () => {
  const mockInputs: UserInputs = {
    yearlyGrossIncome: new Decimal(120000), // $10,000/mo
    coBorrowerIncome: new Decimal(0),
    borrowerDebts: [new Decimal(500)], // $500
    coBorrowerDebts: [],
    incomeTaxRate: new Decimal(0.30),
    availableFunds: new Decimal(100000),
    creditScore: 750,

    interestRate: new Decimal(0.065), // 6.5%
    mortgageTermYears: 30,
    downPaymentPercent: new Decimal(0.20), // 20%
    mortgageInsuranceType: 'Conv - Good Credit',
    yearlyHOA: new Decimal(1200), // $100/mo
    propertyTaxRate: new Decimal(120), // 1.2%
    insuranceRate: new Decimal(42), // 0.42%
  };

  it('determines mortgage insurance rate correctly', () => {
    // 20% down, Conventional Good Credit -> 0
    let rate = getMortgageInsuranceRate(new Decimal(0.20), 'Conv - Good Credit');
    expect(rate.toNumber()).toBe(0);

    // 5% down, Conventional Good Credit -> 60 bps
    rate = getMortgageInsuranceRate(new Decimal(0.05), 'Conv - Good Credit');
    expect(rate.toNumber()).toBe(60);

    // FHA -> 85 bps regardless of conventional
    rate = getMortgageInsuranceRate(new Decimal(0.20), 'FHA');
    expect(rate.toNumber()).toBe(85);
  });

  it('solves max purchase price correctly (circular dependency test)', () => {
    // Target max payment: $2,500
    const maxPayment = new Decimal(2500);
    const result = solveMaxPurchasePrice(mockInputs, maxPayment);
    
    // Verify total payment equals target max payment (within rounding error)
    expect(result.paymentBreakdown.total.toNumber()).toBeCloseTo(2500, 2);
    
    // Verify math adds up
    const breakdownSum = result.paymentBreakdown.principalAndInterest
      .plus(result.paymentBreakdown.propertyTaxes)
      .plus(result.paymentBreakdown.homeownersInsurance)
      .plus(result.paymentBreakdown.mortgageInsurance)
      .plus(result.paymentBreakdown.hoa);
      
    expect(breakdownSum.toNumber()).toBeCloseTo(2500, 2);
    
    // Verify down payment percentage
    const downPaymentRatio = result.downPayment.dividedBy(result.maxPurchasePrice);
    expect(downPaymentRatio.toNumber()).toBeCloseTo(0.20, 4);
    
    // Price should be > 0
    expect(result.maxPurchasePrice.toNumber()).toBeGreaterThan(0);
  });

  it('calculates all risk tiers correctly', () => {
    const results = calculateAllRiskTiers(mockInputs);
    
    expect(results).toHaveLength(5);
    
    const safeTier = results.find(r => r.tier === 'Safe');
    const riskyTier = results.find(r => r.tier === 'Risky');
    
    expect(safeTier).toBeDefined();
    expect(riskyTier).toBeDefined();
    
    // Safe tier should have lower max purchase price than Risky tier
    expect(safeTier!.maxPurchasePrice.toNumber()).toBeLessThan(riskyTier!.maxPurchasePrice.toNumber());
    expect(safeTier!.maxHousingPayment.toNumber()).toBeLessThan(riskyTier!.maxHousingPayment.toNumber());
  });
});
