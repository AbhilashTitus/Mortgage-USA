import Decimal from 'decimal.js';
import { UserInputs } from './types';

/**
 * Calculates the gross monthly income by summing borrower and co-borrower yearly income and dividing by 12.
 */
export function calculateGrossMonthlyIncome(inputs: UserInputs): Decimal {
  const totalYearly = inputs.yearlyGrossIncome.plus(inputs.coBorrowerIncome);
  return totalYearly.dividedBy(12);
}

/**
 * Calculates the net monthly income by applying the income tax rate to the gross monthly income.
 */
export function calculateNetMonthlyIncome(inputs: UserInputs): Decimal {
  const grossMonthly = calculateGrossMonthlyIncome(inputs);
  const taxMultiplier = new Decimal(1).minus(inputs.incomeTaxRate);
  return grossMonthly.times(taxMultiplier);
}

/**
 * Sums all minimum monthly debt payments for both borrower and co-borrower.
 */
export function calculateTotalMonthlyDebts(inputs: UserInputs): Decimal {
  const sumBorrower = inputs.borrowerDebts.reduce((sum, debt) => sum.plus(debt), new Decimal(0));
  const sumCoBorrower = inputs.coBorrowerDebts.reduce((sum, debt) => sum.plus(debt), new Decimal(0));
  return sumBorrower.plus(sumCoBorrower);
}

/**
 * Calculates the maximum housing payment based on Front-End and Back-End DTI limits.
 * The lender will use the lesser of the two maximums.
 * 
 * @param inputs User inputs including income and debts
 * @param frontEndRatio The maximum percentage of gross income allowed for housing
 * @param backEndRatio The maximum percentage of gross income allowed for total debt (housing + existing debts)
 * @returns The maximum allowed monthly housing payment
 */
export function calculateMaxHousingPayment(
  inputs: UserInputs,
  frontEndRatio: Decimal,
  backEndRatio: Decimal
): {
  maxHousingPayment: Decimal;
  frontEndLimit: Decimal;
  backEndLimit: Decimal;
} {
  const grossMonthly = calculateGrossMonthlyIncome(inputs);
  const totalDebts = calculateTotalMonthlyDebts(inputs);

  // Front-End: Gross * FrontEndRatio
  const frontEndLimit = grossMonthly.times(frontEndRatio);

  // Back-End: (Gross * BackEndRatio) - Existing Debts
  const backEndLimitRaw = grossMonthly.times(backEndRatio).minus(totalDebts);
  
  // A limit cannot be negative. If debts exceed the back-end limit, max housing payment is 0.
  const backEndLimit = backEndLimitRaw.isNegative() ? new Decimal(0) : backEndLimitRaw;

  // The final maximum is the minimum of the two
  const maxHousingPayment = Decimal.min(frontEndLimit, backEndLimit);

  return {
    maxHousingPayment,
    frontEndLimit,
    backEndLimit,
  };
}
