import Decimal from 'decimal.js';
import { UserInputs, DashboardSettings, OtherCosts } from './types';
import { UTILITY_COSTS_PER_SQFT, MAINTENANCE_RATES } from './constants';
import { calculateNetMonthlyIncome } from './dti';

/**
 * Calculates estimated other monthly costs (utilities and maintenance) 
 * and flags if total housing costs exceed 42% of net income.
 */
export function calculateOtherCosts(
  inputs: UserInputs,
  settings: DashboardSettings,
  monthlyMortgagePayment: Decimal
): OtherCosts {
  const price = settings.customPrice; // For general estimates on the dashboard, typically based on Custom Price or Max Price

  const utilityRate = UTILITY_COSTS_PER_SQFT[settings.utilityLevel] || UTILITY_COSTS_PER_SQFT.Moderate;
  const monthlyUtilities = utilityRate.times(settings.estimatedSqFt);

  const maintenanceRate = MAINTENANCE_RATES[settings.maintenanceLevel] || MAINTENANCE_RATES.Moderate;
  const monthlyMaintenance = price.times(maintenanceRate).dividedBy(12);

  const totalMonthlyCost = monthlyMortgagePayment.plus(monthlyUtilities).plus(monthlyMaintenance);
  
  const netIncome = calculateNetMonthlyIncome(inputs);
  const remainingIncome = netIncome.minus(totalMonthlyCost);
  
  // Flag warning if total costs exceed 42% of net monthly income
  let warning = false;
  if (!netIncome.isZero()) {
    const costRatio = totalMonthlyCost.dividedBy(netIncome);
    if (costRatio.greaterThan(0.42)) {
      warning = true;
    }
  }

  return {
    monthlyUtilities,
    monthlyMaintenance,
    totalMonthlyCost,
    warning,
    remainingIncome,
  };
}
