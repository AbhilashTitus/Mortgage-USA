import Decimal from 'decimal.js';

export type MortgageInsuranceType =
  | 'Conv - Good Credit'
  | 'Conv - Fair Credit'
  | 'FHA'
  | 'USDA'
  | 'VA';

export type RiskTier = 'Safe' | 'Conservative' | 'Moderate' | 'Aggressive' | 'Risky';

export type UtilityLevel = 'Low' | 'Moderate' | 'High';
export type MaintenanceLevel = 'Low' | 'Moderate' | 'High';
export type ClosingCostOption = '2% of Price' | '2.5% of Price (Typical)' | '3% of Price';

export interface UserInputs {
  downPaymentPercent: Decimal;      // 0-1
  interestRate: Decimal;            // 0-1 (annual)
  mortgageTermYears: number;        // 10, 15, 20, 25, 30
  propertyTaxRate: Decimal;         // basis points
  insuranceRate: Decimal;           // basis points
  mortgageInsuranceType: MortgageInsuranceType;
  yearlyHOA: Decimal;
  incomeTaxRate: Decimal;           // 0-1
  yearlyGrossIncome: Decimal;
  borrowerDebts: Decimal[];         // monthly minimums
  coBorrowerIncome: Decimal;
  coBorrowerDebts: Decimal[];       // monthly minimums
}

export interface PaymentBreakdown {
  principalAndInterest: Decimal;
  propertyTaxes: Decimal;
  mortgageInsurance: Decimal;
  homeownersInsurance: Decimal;
  hoa: Decimal;
  total: Decimal;
}

export interface RiskTierResult {
  tier: RiskTier;
  frontEndRatio: Decimal;
  backEndRatio: Decimal;
  maxHousingPayment: Decimal;
  maxPurchasePrice: Decimal;
  downPayment: Decimal;
  monthlyPayment: PaymentBreakdown;
  percentOfNetIncome: Decimal;
}

export interface TheoryResult {
  name: string;
  description: string;
  purchasePrice: Decimal;
  monthlyPayment: Decimal;
  downPayment: Decimal;
  breakdown: PaymentBreakdown;
}

export interface DashboardSettings {
  selectedRiskTier: RiskTier;
  estimatedSqFt: number;
  utilityLevel: UtilityLevel;
  maintenanceLevel: MaintenanceLevel;
  closingCostOption: ClosingCostOption;
  customPrice: Decimal;
}

export interface PriceComparison {
  scenarioName: string;
  multiplier: Decimal; // 0.9, 0.95, 1.0, 1.05, 1.10
  price: Decimal;
  downPayment: Decimal;
  closingCosts: Decimal;
  mortgagePayment: Decimal;
  maintenanceCost: Decimal;
}

export interface OtherCosts {
  monthlyUtilities: Decimal;
  monthlyMaintenance: Decimal;
  totalMonthlyCost: Decimal;
  warning: boolean; // totalMonthlyCost / netMonthlyIncome > 0.42
  remainingIncome: Decimal;
}

export interface CustomPriceComparison {
  userPrice: Decimal;
  userDownPayment: Decimal;
  userClosingCosts: Decimal;
  userBreakdown: PaymentBreakdown;
  maxPrice: Decimal;
  maxDownPayment: Decimal;
  maxClosingCosts: Decimal;
  maxBreakdown: PaymentBreakdown;
  differenceText: string;
}

export interface CalculationResults {
  riskTiers: RiskTierResult[];
  theories: TheoryResult[];
  priceComparisons: PriceComparison[];
  otherCosts: OtherCosts;
  customPriceComparison: CustomPriceComparison;
  tenKDifference: Decimal;
}
