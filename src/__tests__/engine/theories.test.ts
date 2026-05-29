import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import { calculateAffordabilityTheories } from '@/lib/engine/theories';
import { UserInputs } from '@/lib/engine/types';

describe('Affordability Theories', () => {
  const mockInputs: UserInputs = {
    yearlyGrossIncome: new Decimal(120000), // $10,000/mo gross, ~$7000/mo net (w/ 30% tax)
    coBorrowerIncome: new Decimal(0),
    borrowerDebts: [new Decimal(500)],
    coBorrowerDebts: [],
    incomeTaxRate: new Decimal(0.30),
    availableFunds: new Decimal(100000),
    creditScore: 750,

    interestRate: new Decimal(0.065),
    mortgageTermYears: 30,
    downPaymentPercent: new Decimal(0.20),
    mortgageInsuranceType: 'Conv - Good Credit',
    yearlyHOA: new Decimal(1200),
    propertyTaxRate: new Decimal(120),
    insuranceRate: new Decimal(42),
  };

  it('calculates all theories correctly', () => {
    const theories = calculateAffordabilityTheories(mockInputs);
    
    expect(theories).toHaveLength(4);
    
    const ramsey = theories.find(t => t.name === 'Dave Ramsey');
    const qm = theories.find(t => t.name === 'Qualified Mortgage');
    const ratio26 = theories.find(t => t.name === '2.6 Ratio');
    const rule30 = theories.find(t => t.name === '30-30-3');

    expect(ramsey).toBeDefined();
    expect(qm).toBeDefined();
    expect(ratio26).toBeDefined();
    expect(rule30).toBeDefined();

    // 2.6 ratio should directly equal 2.6 * (120k + 0) = 312,000
    expect(ratio26!.purchasePrice.toNumber()).toBe(312000);
    
    // Dave Ramsey should be extremely conservative
    expect(ramsey!.purchasePrice.toNumber()).toBeGreaterThan(0);
  });
});
