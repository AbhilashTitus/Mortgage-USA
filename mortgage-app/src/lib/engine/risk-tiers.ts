import Decimal from 'decimal.js';
import { UserInputs, RiskTier, RiskTierResult, PaymentBreakdown } from './types';
import { DTI_TIERS, MI_RATES_BPS } from './constants';
import { calculateMaxHousingPayment, calculateNetMonthlyIncome } from './dti';
import { calculatePV } from './mortgage';

/**
 * Determines the mortgage insurance rate (in basis points) based on loan type and down payment.
 */
export function getMortgageInsuranceRate(
  downPaymentPercent: Decimal,
  loanType: UserInputs['mortgageInsuranceType']
): Decimal {
  // If Conventional AND down payment >= 20%, MI = 0
  if (
    downPaymentPercent.greaterThanOrEqualTo(0.2) &&
    (loanType === 'Conv - Good Credit' || loanType === 'Conv - Fair Credit')
  ) {
    return new Decimal(0);
  }

  return MI_RATES_BPS[loanType] || new Decimal(0);
}

/**
 * Iteratively solves for the maximum purchase price given a target maximum monthly payment.
 * Handles the circular dependency where Taxes, MI, and HOI depend on the purchase price.
 */
export function solveMaxPurchasePrice(
  inputs: UserInputs,
  maxMonthlyPayment: Decimal
): {
  maxPurchasePrice: Decimal;
  downPayment: Decimal;
  paymentBreakdown: PaymentBreakdown;
} {
  if (maxMonthlyPayment.isZero() || maxMonthlyPayment.isNegative()) {
    return {
      maxPurchasePrice: new Decimal(0),
      downPayment: new Decimal(0),
      paymentBreakdown: {
        principalAndInterest: new Decimal(0),
        propertyTaxes: new Decimal(0),
        mortgageInsurance: new Decimal(0),
        homeownersInsurance: new Decimal(0),
        hoa: new Decimal(0),
        total: new Decimal(0),
      },
    };
  }

  const monthlyRate = inputs.interestRate.dividedBy(12);
  const nper = inputs.mortgageTermYears * 12;
  const monthlyHOA = inputs.yearlyHOA.dividedBy(12);
  
  const taxRateMonthly = inputs.propertyTaxRate.times(0.0001).dividedBy(12);
  const insRateMonthly = inputs.insuranceRate.times(0.0001).dividedBy(12);
  const miRateBps = getMortgageInsuranceRate(inputs.downPaymentPercent, inputs.mortgageInsuranceType);
  
  // (1 - downPay%) * miRate * 0.0001 / 12
  const miRateMonthly = new Decimal(1)
    .minus(inputs.downPaymentPercent)
    .times(miRateBps)
    .times(0.0001)
    .dividedBy(12);

  // The combined proportional rate for Taxes + HOI + MI relative to purchase price
  const proportionalCostsRate = taxRateMonthly.plus(insRateMonthly).plus(miRateMonthly);

  // Iterative solver for the circular reference
  // Let P = Purchase Price
  // Let PI = Principal & Interest
  // We know:
  // MP = PI + (P * proportionalCostsRate) + HOA
  // P = PV(rate, nper, PI) / (1 - downPaymentPercent)
  
  // Initial guess for Purchase Price: assume all payment goes to P&I (ignoring taxes/ins/mi/hoa for the guess)
  let currentPrice = calculatePV(monthlyRate, nper, maxMonthlyPayment).dividedBy(
    new Decimal(1).minus(inputs.downPaymentPercent)
  );
  
  let currentPI = new Decimal(0);
  const tolerance = new Decimal('0.01');
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    // Calculate P&I by subtracting estimated proportional costs and HOA from max payment
    const estimatedProportionalCosts = currentPrice.times(proportionalCostsRate);
    currentPI = maxMonthlyPayment.minus(estimatedProportionalCosts).minus(monthlyHOA);
    
    // If P&I goes negative, it means taxes/insurance/HOA alone consume the entire max payment
    if (currentPI.isNegative()) {
      currentPI = new Decimal(0);
      currentPrice = new Decimal(0);
      break;
    }
    
    // Recalculate price based on new P&I
    const newPrice = calculatePV(monthlyRate, nper, currentPI).dividedBy(
      new Decimal(1).minus(inputs.downPaymentPercent)
    );
    
    // Check for convergence
    if (newPrice.minus(currentPrice).abs().lessThan(tolerance)) {
      currentPrice = newPrice;
      break;
    }
    
    // Dampened update to prevent oscillation
    currentPrice = currentPrice.plus(newPrice).dividedBy(2);
  }

  // Final calculations
  const downPayment = currentPrice.times(inputs.downPaymentPercent);
  const propertyTaxes = currentPrice.times(taxRateMonthly);
  const homeownersInsurance = currentPrice.times(insRateMonthly);
  const mortgageInsurance = currentPrice.times(miRateMonthly);
  
  const total = currentPI.plus(propertyTaxes).plus(homeownersInsurance).plus(mortgageInsurance).plus(monthlyHOA);

  return {
    maxPurchasePrice: currentPrice,
    downPayment,
    paymentBreakdown: {
      principalAndInterest: currentPI,
      propertyTaxes,
      homeownersInsurance,
      mortgageInsurance,
      hoa: monthlyHOA,
      total,
    }
  };
}

/**
 * Calculates results for all 5 risk tiers.
 */
export function calculateAllRiskTiers(inputs: UserInputs): RiskTierResult[] {
  const netMonthlyIncome = calculateNetMonthlyIncome(inputs);
  const tiers: RiskTier[] = ['Safe', 'Conservative', 'Moderate', 'Aggressive', 'Risky'];
  
  return tiers.map(tier => {
    const limits = DTI_TIERS[tier];
    
    const { maxHousingPayment } = calculateMaxHousingPayment(
      inputs,
      limits.frontEnd,
      limits.backEnd
    );
    
    const { maxPurchasePrice, downPayment, paymentBreakdown } = solveMaxPurchasePrice(inputs, maxHousingPayment);
    
    // Avoid division by zero
    let percentOfNetIncome = new Decimal(0);
    if (!netMonthlyIncome.isZero()) {
      percentOfNetIncome = paymentBreakdown.total.dividedBy(netMonthlyIncome).times(100).round();
    }
    
    return {
      tier,
      frontEndRatio: limits.frontEnd,
      backEndRatio: limits.backEnd,
      maxHousingPayment,
      maxPurchasePrice,
      downPayment,
      monthlyPayment: paymentBreakdown,
      percentOfNetIncome,
    };
  });
}
