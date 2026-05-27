import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { calculateAllRiskTiers } from '@/lib/engine/risk-tiers';
import { calculateAffordabilityTheories } from '@/lib/engine/theories';
import { calculatePriceComparisons, calculateTenKDifference } from '@/lib/engine/price-comparison';
import { calculateOtherCosts } from '@/lib/engine/other-costs';
import { CalculationResults, UserInputs, DashboardSettings, CustomPriceComparison, PaymentBreakdown } from '@/lib/engine/types';
import Decimal from 'decimal.js';
import { CLOSING_COST_OPTIONS } from '@/lib/engine/constants';
import { getMortgageInsuranceRate } from '@/lib/engine/risk-tiers';
import { calculatePMT } from '@/lib/engine/mortgage';

export function useAffordabilityEngine(): CalculationResults | null {
  const { userInputs, settings } = useAppStore();

  return useMemo(() => {
    try {
      // 1. Convert primitive store state to Decimal for the engine
      const inputs: UserInputs = {
        downPaymentPercent: new Decimal(userInputs.downPaymentPercent).dividedBy(100),
        interestRate: new Decimal(userInputs.interestRate).dividedBy(100),
        mortgageTermYears: userInputs.mortgageTermYears,
        propertyTaxRate: new Decimal(userInputs.propertyTaxRate),
        insuranceRate: new Decimal(userInputs.insuranceRate),
        mortgageInsuranceType: userInputs.mortgageInsuranceType,
        yearlyHOA: new Decimal(userInputs.yearlyHOA),
        incomeTaxRate: new Decimal(userInputs.incomeTaxRate).dividedBy(100),
        yearlyGrossIncome: new Decimal(userInputs.yearlyGrossIncome),
        borrowerDebts: userInputs.borrowerDebts.map(d => new Decimal(d)),
        coBorrowerIncome: new Decimal(userInputs.coBorrowerIncome),
        coBorrowerDebts: userInputs.coBorrowerDebts.map(d => new Decimal(d)),
      };

      const dashSettings: DashboardSettings = {
        selectedRiskTier: settings.selectedRiskTier,
        estimatedSqFt: settings.estimatedSqFt,
        utilityLevel: settings.utilityLevel,
        maintenanceLevel: settings.maintenanceLevel,
        closingCostOption: settings.closingCostOption,
        customPrice: new Decimal(settings.customPrice),
      };

      // 2. Run Engine Calculations
      const riskTiers = calculateAllRiskTiers(inputs);
      const theories = calculateAffordabilityTheories(inputs);
      // Select the active tier based on settings
      const activeTierResult = riskTiers.find(t => t.tier === settings.selectedRiskTier) || riskTiers[2];

      const otherCosts = calculateOtherCosts(inputs, dashSettings, activeTierResult.monthlyPayment.total);
      const tenKDifference = calculateTenKDifference(inputs);

      const priceComparisons = calculatePriceComparisons(
        activeTierResult.maxPurchasePrice,
        activeTierResult.monthlyPayment.total,
        inputs,
        dashSettings
      );

      // 3. Custom Price Calculator Logic (if user set a custom price)
      let customPriceComparison: CustomPriceComparison = {
        userPrice: new Decimal(0),
        userDownPayment: new Decimal(0),
        userClosingCosts: new Decimal(0),
        userBreakdown: activeTierResult.monthlyPayment,
        maxPrice: activeTierResult.maxPurchasePrice,
        maxDownPayment: activeTierResult.downPayment,
        maxClosingCosts: activeTierResult.maxPurchasePrice.times(CLOSING_COST_OPTIONS[settings.closingCostOption] || 0.025),
        maxBreakdown: activeTierResult.monthlyPayment,
        differenceText: "Set a custom price to compare.",
      };

      if (dashSettings.customPrice.greaterThan(0)) {
        const uPrice = dashSettings.customPrice;
        const uDownPayment = uPrice.times(inputs.downPaymentPercent);
        const uLoanAmount = uPrice.minus(uDownPayment);
        const uPI = calculatePMT(inputs.interestRate.dividedBy(12), inputs.mortgageTermYears * 12, uLoanAmount);
        
        const uTax = uPrice.times(inputs.propertyTaxRate).times(0.0001).dividedBy(12);
        const uIns = uPrice.times(inputs.insuranceRate).times(0.0001).dividedBy(12);
        const uMI = uPrice.times(new Decimal(1).minus(inputs.downPaymentPercent))
                          .times(getMortgageInsuranceRate(inputs.downPaymentPercent, inputs.mortgageInsuranceType))
                          .times(0.0001).dividedBy(12);
        const uHOA = inputs.yearlyHOA.dividedBy(12);
        
        const uTotal = uPI.plus(uTax).plus(uIns).plus(uMI).plus(uHOA);
        
        const userBreakdown: PaymentBreakdown = {
          principalAndInterest: uPI,
          propertyTaxes: uTax,
          mortgageInsurance: uMI,
          homeownersInsurance: uIns,
          hoa: uHOA,
          total: uTotal,
        };

        const uClosingCosts = uPrice.times(CLOSING_COST_OPTIONS[settings.closingCostOption] || 0.025);
        
        const diff = uPrice.minus(activeTierResult.maxPurchasePrice);
        const diffPayment = uTotal.minus(activeTierResult.monthlyPayment.total);
        
        let diffText = "Matches your maximum.";
        if (diff.greaterThan(0)) {
          diffText = `This is $${diff.toNumber().toLocaleString('en-US', {maximumFractionDigits:0})} over your maximum, resulting in $${diffPayment.toNumber().toLocaleString('en-US', {maximumFractionDigits:0})} more per month.`;
        } else if (diff.lessThan(0)) {
          diffText = `This is $${Math.abs(diff.toNumber()).toLocaleString('en-US', {maximumFractionDigits:0})} under your maximum, saving $${Math.abs(diffPayment.toNumber()).toLocaleString('en-US', {maximumFractionDigits:0})} per month.`;
        }

        customPriceComparison = {
          userPrice: uPrice,
          userDownPayment: uDownPayment,
          userClosingCosts: uClosingCosts,
          userBreakdown,
          maxPrice: activeTierResult.maxPurchasePrice,
          maxDownPayment: activeTierResult.downPayment,
          maxClosingCosts: activeTierResult.maxPurchasePrice.times(CLOSING_COST_OPTIONS[settings.closingCostOption] || 0.025),
          maxBreakdown: activeTierResult.monthlyPayment,
          differenceText: diffText,
        };
      }

      return {
        riskTiers,
        theories,
        priceComparisons,
        otherCosts,
        customPriceComparison,
        tenKDifference,
      };
    } catch (e) {
      console.error("Engine calculation error:", e);
      return null;
    }
  }, [userInputs, settings]);
}
