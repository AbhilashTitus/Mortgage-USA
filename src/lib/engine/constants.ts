import Decimal from 'decimal.js';
import { RiskTier, MortgageInsuranceType, UtilityLevel, MaintenanceLevel } from './types';

export const DTI_TIERS: Record<RiskTier, { frontEnd: Decimal; backEnd: Decimal }> = {
  Safe: { frontEnd: new Decimal('0.25'), backEnd: new Decimal('0.28') },
  Conservative: { frontEnd: new Decimal('0.28'), backEnd: new Decimal('0.36') },
  Moderate: { frontEnd: new Decimal('0.36'), backEnd: new Decimal('0.43') },
  Aggressive: { frontEnd: new Decimal('0.45'), backEnd: new Decimal('0.49') },
  Risky: { frontEnd: new Decimal('0.46'), backEnd: new Decimal('0.55') },
};

export const MI_RATES_BPS: Record<MortgageInsuranceType, Decimal> = {
  'Conv - Good Credit': new Decimal('60'),
  'Conv - Fair Credit': new Decimal('80'),
  'FHA': new Decimal('55'),
  'USDA': new Decimal('35'),
  'VA': new Decimal('0'),
};

export const UTILITY_COSTS_PER_SQFT: Record<UtilityLevel, Decimal> = {
  Low: new Decimal('0.06'),
  Moderate: new Decimal('0.10'),
  High: new Decimal('0.14'),
};

export const MAINTENANCE_RATES: Record<MaintenanceLevel, Decimal> = {
  Low: new Decimal('0.0025'),     // 0.25%
  Moderate: new Decimal('0.005'), // 0.5%
  High: new Decimal('0.01'),      // 1.0%
};

export const CLOSING_COST_OPTIONS = {
  '2% of Price': new Decimal('0.02'),
  '2.5% of Price (Typical)': new Decimal('0.025'),
  '3% of Price': new Decimal('0.03'),
};
