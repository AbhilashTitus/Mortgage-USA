import { z } from 'zod';

export const UserInputSchema = z.object({
  downPaymentPercent: z.number().min(0).max(100),   // Display value: 20 means 20%
  interestRate: z.number().min(0).max(20),           // Display value: 6.5 means 6.5%
  mortgageTermYears: z.number().int().positive(),
  propertyTaxRate: z.number().min(0),                // Basis points
  insuranceRate: z.number().min(0),                  // Basis points
  mortgageInsuranceType: z.enum(['Conv - Good Credit', 'Conv - Fair Credit', 'FHA', 'USDA', 'VA']),
  yearlyHOA: z.number().min(0),
  incomeTaxRate: z.number().min(0).max(100),         // Display value: 25 means 25%
  yearlyGrossIncome: z.number().min(0),
  borrowerDebts: z.array(z.number().min(0)),
  coBorrowerIncome: z.number().min(0),
  coBorrowerDebts: z.array(z.number().min(0)),
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
