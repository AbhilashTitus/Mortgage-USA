import Decimal from 'decimal.js';

/**
 * Calculates the monthly payment for a loan (PMT).
 * Formula: pv * rate * (1 + rate)^nper / ((1 + rate)^nper - 1)
 *
 * @param rate - The monthly interest rate (annual rate / 12).
 * @param nper - The total number of payments (years * 12).
 * @param pv - The present value (loan amount).
 * @returns The positive monthly payment amount.
 */
export function calculatePMT(rate: Decimal, nper: number, pv: Decimal): Decimal {
  if (rate.isZero()) {
    return nper === 0 ? new Decimal(0) : pv.dividedBy(nper);
  }

  // rate * (1 + rate)^nper
  const onePlusRate = new Decimal(1).plus(rate);
  const compounded = onePlusRate.pow(nper);
  const numerator = pv.times(rate).times(compounded);
  const denominator = compounded.minus(1);

  return numerator.dividedBy(denominator);
}

/**
 * Calculates the present value of a loan (PV).
 * Formula: pmt * ((1 - (1 + rate)^(-nper)) / rate)
 *
 * @param rate - The monthly interest rate (annual rate / 12).
 * @param nper - The total number of payments (years * 12).
 * @param pmt - The monthly payment amount.
 * @returns The present value (loan amount).
 */
export function calculatePV(rate: Decimal, nper: number, pmt: Decimal): Decimal {
  if (rate.isZero()) {
    return pmt.times(nper);
  }

  // pmt * ((1 - (1 + rate)^-nper) / rate)
  const onePlusRate = new Decimal(1).plus(rate);
  const discounted = onePlusRate.pow(-nper);
  const numerator = new Decimal(1).minus(discounted);
  
  return pmt.times(numerator.dividedBy(rate));
}
