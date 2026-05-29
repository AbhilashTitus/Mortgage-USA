import Decimal from 'decimal.js';
import { UserInputs, TheoryResult } from './types';
import { calculateGrossMonthlyIncome, calculateNetMonthlyIncome } from './dti';
import { calculatePMT } from './mortgage';
import { solveMaxPurchasePrice, getMortgageInsuranceRate } from './risk-tiers';

export function calculateAffordabilityTheories(inputs: UserInputs): TheoryResult[] {
  const grossMonthly = calculateGrossMonthlyIncome(inputs);
  const netMonthly = calculateNetMonthlyIncome(inputs);
  const totalGrossYearly = inputs.yearlyGrossIncome.plus(inputs.coBorrowerIncome);
  
  const results: TheoryResult[] = [];

  // --- 1. Dave Ramsey ---
  // 25% of net pay, 15yr term, 10% down, no other debt
  const ramseyInputs: UserInputs = {
    ...inputs,
    mortgageTermYears: 15,
    downPaymentPercent: new Decimal('0.10'),
    borrowerDebts: [],
    coBorrowerDebts: [],
  };
  const ramseyMaxPayment = netMonthly.times(0.25);
  const ramseyResult = solveMaxPurchasePrice(ramseyInputs, ramseyMaxPayment);
  
  results.push({
    name: 'Dave Ramsey',
    description: 'Financial personality Dave Ramsey suggests paying no more than 25% of your take home pay on a mortgage. He also suggests only a 15 year mortgage with minimum 10% down and no other debt.',
    purchasePrice: ramseyResult.maxPurchasePrice,
    monthlyPayment: ramseyResult.paymentBreakdown.total,
    downPayment: ramseyResult.downPayment,
    breakdown: ramseyResult.paymentBreakdown,
  });

  // --- 2. Qualified Mortgage ---
  // Max DTI 43% of gross income, 15yr term
  const qmInputs: UserInputs = {
    ...inputs,
    mortgageTermYears: 15,
  };
  const qmMaxPayment = grossMonthly.times(0.43);
  const qmResult = solveMaxPurchasePrice(qmInputs, qmMaxPayment);
  
  results.push({
    name: 'Qualified Mortgage',
    description: 'Evidence from studies of mortgage loans suggest that borrowers with a debt-to-income ratio higher than 43% are more likely to run into trouble making monthly payments.',
    purchasePrice: qmResult.maxPurchasePrice,
    monthlyPayment: qmResult.paymentBreakdown.total,
    downPayment: qmResult.downPayment,
    breakdown: qmResult.paymentBreakdown,
  });

  // --- 3. 2.6 Ratio ---
  // Max price 2.6x gross annual income. Direct calculation.
  const ratioPrice = totalGrossYearly.times(2.6);
  const ratioDown = ratioPrice.times(inputs.downPaymentPercent);
  const ratioPI = calculatePMT(inputs.interestRate.dividedBy(12), inputs.mortgageTermYears * 12, ratioPrice.minus(ratioDown));
  
  const ratioTax = ratioPrice.times(inputs.propertyTaxRate).times(0.0001).dividedBy(12);
  const ratioIns = ratioPrice.times(inputs.insuranceRate).times(0.0001).dividedBy(12);
  const ratioMI = ratioPrice.times(new Decimal(1).minus(inputs.downPaymentPercent))
                            .times(getMortgageInsuranceRate(inputs.downPaymentPercent, inputs.mortgageInsuranceType))
                            .times(0.0001).dividedBy(12);
  const ratioHOA = inputs.yearlyHOA.dividedBy(12);
  
  const ratioTotal = ratioPI.plus(ratioTax).plus(ratioIns).plus(ratioMI).plus(ratioHOA);

  results.push({
    name: '2.6 Ratio',
    description: 'Economists judge a market\'s affordability health based on a ratio of income to price. These experts believe a home price of 2.6 times income is healthy.',
    purchasePrice: ratioPrice,
    monthlyPayment: ratioTotal,
    downPayment: ratioDown,
    breakdown: {
      principalAndInterest: ratioPI,
      propertyTaxes: ratioTax,
      mortgageInsurance: ratioMI,
      homeownersInsurance: ratioIns,
      hoa: ratioHOA,
      total: ratioTotal,
    }
  });

  // --- 4. 30-30-3 ---
  // Max payment 30% of gross income, 20% down, 15yr term
  const ruleInputs: UserInputs = {
    ...inputs,
    mortgageTermYears: 15,
    downPaymentPercent: new Decimal('0.20'),
  };
  const ruleMaxPayment = grossMonthly.times(0.30);
  const ruleResult = solveMaxPurchasePrice(ruleInputs, ruleMaxPayment);

  results.push({
    name: '30-30-3',
    description: 'Loved by personal finance enthusiasts, this model suggests spending no more than 30% of your gross income, with at least 30% cash saved (20% down payment and 10% buffer), and the price should be no more than 3 times your annual income.',
    purchasePrice: ruleResult.maxPurchasePrice,
    monthlyPayment: ruleResult.paymentBreakdown.total,
    downPayment: ruleResult.downPayment,
    breakdown: ruleResult.paymentBreakdown,
  });

  return results;
}
