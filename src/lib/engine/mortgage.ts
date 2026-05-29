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

export interface AmortizationYear {
  year: number;
  principalPaid: Decimal;
  interestCharged: Decimal;
  totalPayment: Decimal;
  remainingBalance: Decimal;
}

/**
 * Generates a yearly amortization schedule.
 */
export function generateAmortizationSchedule(
  loanAmount: Decimal, 
  annualRate: number, 
  termYears: number, 
  pmt: Decimal
): AmortizationYear[] {
  const monthlyRate = new Decimal(annualRate).dividedBy(100).dividedBy(12);
  let balance = loanAmount;
  const schedule: AmortizationYear[] = [];
  
  for (let year = 1; year <= termYears; year++) {
    let yearPrincipal = new Decimal(0);
    let yearInterest = new Decimal(0);
    let yearPayment = new Decimal(0);
    
    for (let month = 1; month <= 12; month++) {
      if (balance.lessThanOrEqualTo(0.01)) break;
      
      const interest = balance.times(monthlyRate);
      let principal = pmt.minus(interest);
      let payment = pmt;
      
      if (balance.lessThan(principal)) {
        principal = balance;
        payment = principal.plus(interest);
      }
      
      balance = balance.minus(principal);
      yearPrincipal = yearPrincipal.plus(principal);
      yearInterest = yearInterest.plus(interest);
      yearPayment = yearPayment.plus(payment);
    }
    
    schedule.push({
      year,
      principalPaid: yearPrincipal,
      interestCharged: yearInterest,
      totalPayment: yearPayment,
      remainingBalance: balance.greaterThan(0.01) ? balance : new Decimal(0),
    });
    
    if (balance.lessThanOrEqualTo(0.01)) break;
  }
  
  return schedule;
}
