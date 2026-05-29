import Decimal from 'decimal.js';
import { UserInputs, DashboardSettings, OtherCosts } from './types';
import { UTILITY_COSTS_PER_SQFT, MAINTENANCE_RATES } from './constants';
import { calculateNetMonthlyIncome } from './dti';

/**
 * Calculates estimated other monthly costs (utilities and maintenance) 
 * and flags if total housing costs exceed 42% of net income.
 * 
 * @param inputs User financial inputs
 * @param settings Dashboard settings (sqft, utility level, maintenance level)
 * @param purchasePrice The purchase price to base maintenance costs on (active tier's max price)
 * @param monthlyMortgagePayment The total monthly mortgage payment (P&I + taxes + ins + MI + HOA)
 */
export function calculateOtherCosts(
  inputs: UserInputs,
  settings: DashboardSettings,
  purchasePrice: Decimal,
  monthlyMortgagePayment: Decimal
): OtherCosts {
  const utilityRate = UTILITY_COSTS_PER_SQFT[settings.utilityLevel] || UTILITY_COSTS_PER_SQFT.Moderate;
  const monthlyUtilities = utilityRate.times(settings.estimatedSqFt);

  const maintenanceRate = MAINTENANCE_RATES[settings.maintenanceLevel] || MAINTENANCE_RATES.Moderate;
  const monthlyMaintenance = purchasePrice.times(maintenanceRate).dividedBy(12);

  const totalMonthlyCost = monthlyMortgagePayment.plus(monthlyUtilities).plus(monthlyMaintenance);
  
  const netIncome = calculateNetMonthlyIncome(inputs);
  const remainingIncome = netIncome.minus(totalMonthlyCost);
  
  // Calculate percentage of take-home pay
  let percentOfTakeHome = new Decimal(0);
  let warning = false;
  if (!netIncome.isZero()) {
    const costRatio = totalMonthlyCost.dividedBy(netIncome);
    percentOfTakeHome = costRatio.times(100).toDecimalPlaces(0);
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
    percentOfTakeHome,
    netMonthlyIncome: netIncome,
  };
}
