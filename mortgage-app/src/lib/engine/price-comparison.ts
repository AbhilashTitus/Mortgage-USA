import Decimal from 'decimal.js';
import { UserInputs, PriceComparison, ClosingCostOption, DashboardSettings } from './types';
import { CLOSING_COST_OPTIONS, MAINTENANCE_RATES } from './constants';
import { calculatePMT } from './mortgage';
import { getMortgageInsuranceRate } from './risk-tiers';

/**
 * Calculates closing costs based on the selected option.
 */
export function calculateClosingCosts(price: Decimal, option: ClosingCostOption): Decimal {
  const rate = CLOSING_COST_OPTIONS[option] || CLOSING_COST_OPTIONS['2.5% of Price (Typical)'];
  return price.times(rate);
}

/**
 * Calculates price comparison scenarios (-10%, -5%, Baseline, +5%, +10%) based on the max purchase price.
 */
export function calculatePriceComparisons(
  basePrice: Decimal,
  basePayment: Decimal,
  inputs: UserInputs,
  settings: DashboardSettings
): PriceComparison[] {
  const multipliers = [
    { name: '- 10% lower', multiplier: new Decimal('0.9') },
    { name: '- 5% lower', multiplier: new Decimal('0.95') },
    { name: 'Asking Price', multiplier: new Decimal('1.0') },
    { name: '+ 5% higher', multiplier: new Decimal('1.05') },
    { name: '+ 10% higher', multiplier: new Decimal('1.10') },
  ];

  const maintenanceRate = MAINTENANCE_RATES[settings.maintenanceLevel];

  return multipliers.map(({ name, multiplier }) => {
    const price = basePrice.times(multiplier);
    const downPayment = price.times(inputs.downPaymentPercent);
    const closingCosts = calculateClosingCosts(price, settings.closingCostOption);
    const mortgagePayment = basePayment.times(multiplier);
    const maintenanceCost = price.times(maintenanceRate).dividedBy(12);

    return {
      scenarioName: name,
      multiplier,
      price,
      downPayment,
      closingCosts,
      mortgagePayment,
      maintenanceCost,
    };
  });
}

/**
 * Estimates the change in monthly payment for a $10,000 difference in purchase price.
 * Fixes the spreadsheet bug by correctly using the interest rate for PMT, not the down payment percent.
 */
export function calculateTenKDifference(inputs: UserInputs): Decimal {
  const priceDiff = new Decimal(10000);
  
  // P&I change based on loan amount difference ($10k * (1 - dp%))
  const loanAmountDiff = priceDiff.times(new Decimal(1).minus(inputs.downPaymentPercent));
  const piDiff = calculatePMT(inputs.interestRate.dividedBy(12), inputs.mortgageTermYears * 12, loanAmountDiff);
  
  // Tax change
  const taxDiff = priceDiff.times(inputs.propertyTaxRate).times(0.0001).dividedBy(12);
  
  // HOI change
  const hoiDiff = priceDiff.times(inputs.insuranceRate).times(0.0001).dividedBy(12);
  
  // MI change
  const miRateBps = getMortgageInsuranceRate(inputs.downPaymentPercent, inputs.mortgageInsuranceType);
  const miDiff = priceDiff.times(new Decimal(1).minus(inputs.downPaymentPercent))
                          .times(miRateBps).times(0.0001).dividedBy(12);
                          
  return piDiff.plus(taxDiff).plus(hoiDiff).plus(miDiff);
}
