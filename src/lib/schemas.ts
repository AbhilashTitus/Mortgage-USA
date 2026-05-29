import { z } from 'zod';

export const UserInputSchema = z.object({
  downPaymentPercent: z.number().min(0).max(99),     // Max 99% to prevent division by zero in PV math
  interestRate: z.number().min(0).max(30),           // Max 30%
  mortgageTermYears: z.number().int().positive().max(50), // Max 50 years
  propertyTaxRate: z.number().min(0).max(2000),      // Max 20% (2000 bps)
  insuranceRate: z.number().min(0).max(2000),        // Max 20% (2000 bps)
  mortgageInsuranceType: z.enum(['Conv - Good Credit', 'Conv - Fair Credit', 'FHA', 'USDA', 'VA']),
  yearlyHOA: z.number().min(0).max(240000),          // Max $20k/month
  incomeTaxRate: z.number().min(0).max(100),         // Display value: 25 means 25%
  yearlyGrossIncome: z.number().min(0),
  borrowerDebts: z.preprocess(
    (val) => Array.isArray(val) ? val.map((v: any) => typeof v === 'number' ? { name: "Legacy Debt", amount: v } : v) : val,
    z.array(z.object({ name: z.string(), amount: z.number().min(0) }))
  ),
  coBorrowerIncome: z.number().min(0),
  coBorrowerDebts: z.preprocess(
    (val) => Array.isArray(val) ? val.map((v: any) => typeof v === 'number' ? { name: "Legacy Debt", amount: v } : v) : val,
    z.array(z.object({ name: z.string(), amount: z.number().min(0) }))
  ),
});

export const DashboardSettingsSchema = z.object({
  selectedRiskTier: z.enum(['Safe', 'Conservative', 'Moderate', 'Aggressive', 'Risky']),
  estimatedSqFt: z.number().positive(),
  utilityLevel: z.enum(['Low', 'Moderate', 'High']),
  maintenanceLevel: z.enum(['Low', 'Moderate', 'High']),
  closingCostOption: z.enum(['2% of Price', '2.5% of Price (Typical)', '3% of Price']),
  customPrice: z.number().min(0),
});

export type UserInputState = z.infer<typeof UserInputSchema>;
export type DashboardSettingsState = z.infer<typeof DashboardSettingsSchema>;
