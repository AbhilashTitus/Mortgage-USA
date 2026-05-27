import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import { calculatePMT, calculatePV } from '@/lib/engine/mortgage';

describe('Mortgage Financial Math', () => {
  it('calculates PMT correctly (standard)', () => {
    // $300,000 loan, 30 years, 6.5% interest
    const pv = new Decimal(300000);
    const rate = new Decimal(6.5).div(100).div(12); // Monthly rate
    const nper = 30 * 12;

    const pmt = calculatePMT(rate, nper, pv);
    expect(pmt.toNumber()).toBeCloseTo(1896.20, 2);
  });

  it('calculates PMT correctly for 0% interest rate', () => {
    const pv = new Decimal(300000);
    const rate = new Decimal(0);
    const nper = 360;

    const pmt = calculatePMT(rate, nper, pv);
    expect(pmt.toNumber()).toBeCloseTo(833.33, 2);
  });

  it('calculates PV correctly (standard)', () => {
    // Target payment $1,896.20, 30 years, 6.5% interest -> ~$300,000
    const pmt = new Decimal(1896.2043689454178);
    const rate = new Decimal(6.5).div(100).div(12);
    const nper = 30 * 12;

    const pv = calculatePV(rate, nper, pmt);
    expect(Math.round(pv.toNumber())).toBe(300000);
  });

  it('calculates PV correctly for 0% interest rate', () => {
    const pmt = new Decimal(833.3333333333334);
    const rate = new Decimal(0);
    const nper = 360;

    const pv = calculatePV(rate, nper, pmt);
    expect(pv.toNumber()).toBeCloseTo(300000, 2);
  });
});
