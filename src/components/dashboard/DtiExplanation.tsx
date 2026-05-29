"use client";

import { RiskTierResult } from "@/lib/engine/types";
import { useAppStore } from "@/lib/store";
import Decimal from "decimal.js";
import { calculateGrossMonthlyIncome, calculateNetMonthlyIncome, calculateTotalMonthlyDebts } from "@/lib/engine/dti";
import { useMemo } from "react";
import { Check } from "lucide-react";

interface DtiExplanationProps {
  activeTier: RiskTierResult;
}

function fmt(val: Decimal, decimals = 0): string {
  return "$" + val.toNumber().toLocaleString("en-US", { maximumFractionDigits: decimals });
}

function pct(val: Decimal): string {
  return val.times(100).toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 }) + "%";
}

export function DtiExplanation({ activeTier }: DtiExplanationProps) {
  const { userInputs } = useAppStore();

  const computedValues = useMemo(() => {
    const inputs = {
      downPaymentPercent: new Decimal(userInputs.downPaymentPercent).dividedBy(100),
      interestRate: new Decimal(userInputs.interestRate).dividedBy(100),
      mortgageTermYears: userInputs.mortgageTermYears,
      propertyTaxRate: new Decimal(userInputs.propertyTaxRate),
      insuranceRate: new Decimal(userInputs.insuranceRate),
      mortgageInsuranceType: userInputs.mortgageInsuranceType,
      yearlyHOA: new Decimal(userInputs.yearlyHOA),
      incomeTaxRate: new Decimal(userInputs.incomeTaxRate).dividedBy(100),
      yearlyGrossIncome: new Decimal(userInputs.yearlyGrossIncome),
      borrowerDebts: userInputs.borrowerDebts.map((d: any) => new Decimal(typeof d === "number" ? d : (d?.amount || 0))),
      coBorrowerIncome: new Decimal(userInputs.coBorrowerIncome),
      coBorrowerDebts: userInputs.coBorrowerDebts.map((d: any) => new Decimal(typeof d === "number" ? d : (d?.amount || 0))),
    };

    const grossMonthly = calculateGrossMonthlyIncome(inputs);
    const netMonthly = calculateNetMonthlyIncome(inputs);
    const totalDebts = calculateTotalMonthlyDebts(inputs);
    const totalGrossYearly = inputs.yearlyGrossIncome.plus(inputs.coBorrowerIncome);

    const maxDebtAllowed = grossMonthly.times(activeTier.backEndRatio);
    const backEndDtiNumber = maxDebtAllowed.minus(totalDebts);
    const frontEndDtiNumber = grossMonthly.times(activeTier.frontEndRatio);
    const backEndIsLowest = backEndDtiNumber.lessThanOrEqualTo(frontEndDtiNumber);

    return {
      grossMonthly,
      netMonthly,
      totalDebts,
      totalGrossYearly,
      maxDebtAllowed,
      backEndDtiNumber: backEndDtiNumber.isNegative() ? new Decimal(0) : backEndDtiNumber,
      frontEndDtiNumber,
      backEndIsLowest,
    };
  }, [userInputs, activeTier]);

  const { grossMonthly, netMonthly, totalDebts, totalGrossYearly, maxDebtAllowed, backEndDtiNumber, frontEndDtiNumber, backEndIsLowest } = computedValues;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">How Do Lenders Look At Your Debt-To-Income?</h2>
      </div>

      {/* Intro text */}
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Your total yearly (gross) income is <strong className="text-foreground">{fmt(totalGrossYearly)}</strong>. 
          That&apos;s <strong className="text-foreground">{fmt(grossMonthly)}/mo</strong> before taxes and 
          around <strong className="text-foreground">{fmt(netMonthly)}/mo</strong> after taxes.
          Lenders use a debt-to-income ratio to determine your maximum monthly payment.
        </p>
        <p>
          They multiply your monthly gross income and a debt-to-income limit. The actual debt-to-income
          limit for your situation will depend on the lender you choose, loan you choose, your credit score, and
          other risk factors for a loan. Since this is just an example of how DTI works, we&apos;ll use the risk level you
          choose as an example:
        </p>
        
        <div className="bg-blue-50/50 border border-blue-100 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-200 rounded-lg p-4 mt-2">
          <p className="font-semibold text-xs uppercase tracking-wider mb-1">💡 Good to know</p>
          <p className="text-sm">
            Notice that your Debt-to-Income metrics are determined <strong>purely by your Income and Debts</strong>. 
            Adjusting interest rates or down payments will <strong>not</strong> change your allowed monthly payment—they only affect the <em>purchase price</em> of the home you can buy with this monthly payment!
          </p>
        </div>
      </div>

      {/* DTI Math Title */}
      <div>
        <h3 className="text-lg font-bold mb-6">
          Debt-To-Income Math with a <span className="text-primary">{activeTier.tier}</span> risk level:
        </h3>
      </div>

      {/* Back-End DTI Calculation */}
      <div className="bg-muted/30 rounded-xl p-6 space-y-6">
        {/* Gross × BackEnd = Max Debt */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{fmt(grossMonthly)}/mo</p>
            <p className="text-xs text-muted-foreground">Your Gross Income</p>
          </div>
          <span className="text-xl font-bold text-muted-foreground">×</span>
          <div>
            <p className="text-2xl font-bold text-amber-600">{pct(activeTier.backEndRatio)}</p>
            <p className="text-xs text-muted-foreground">Back-End DTI</p>
            <p className="text-[10px] text-muted-foreground italic">Limit</p>
          </div>
          <span className="text-xl font-bold text-muted-foreground">=</span>
          <div>
            <p className="text-2xl font-bold text-green-600">{fmt(maxDebtAllowed)}</p>
            <p className="text-xs text-muted-foreground">Max Debt Allowed</p>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-sm text-muted-foreground text-center">
          Next, they subtract your minimum monthly debt payments to find the maximum housing payment you can have.
        </p>

        {/* Max Debt - Debts = Back-End Number */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{fmt(maxDebtAllowed)}/mo</p>
            <p className="text-xs text-muted-foreground">Max Debt Allowed</p>
          </div>
          <span className="text-xl font-bold text-muted-foreground">−</span>
          <div>
            <p className="text-2xl font-bold text-red-500">{fmt(totalDebts)}</p>
            <p className="text-xs text-muted-foreground">Debt Payments</p>
            <p className="text-[10px] text-muted-foreground italic">Minimum Monthly Payments</p>
          </div>
          <span className="text-xl font-bold text-muted-foreground">=</span>
          <div>
            <p className="text-2xl font-bold text-purple-600">{fmt(backEndDtiNumber)}</p>
            <p className="text-xs text-muted-foreground">Back-End DTI Number</p>
          </div>
        </div>
      </div>

      {/* Front-End Explanation */}
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          The <strong className="text-foreground">Front-End Debt-To-Income Ratio</strong> (also called the housing ratio) is the maximum housing
          payment you can have.
        </p>
        <p className="italic text-primary/80">
          For a {activeTier.tier} risk level we&apos;ll use {pct(activeTier.frontEndRatio)} as the front-end ratio.
        </p>
        <p>
          The <strong className="text-foreground">Back-End Debt-To-Income Ratio</strong> is the maximum total debt you can have. This includes your
          future housing payment + your monthly minimum debt payments. We actually already figured out
          this number above as the Back-End DTI Number.
        </p>
        <p className="italic text-primary/80">
          For a {activeTier.tier} risk level we&apos;ll use {pct(activeTier.backEndRatio)} as the back-end ratio.
        </p>
        <p>
          Lenders will look at your Front-End DTI and your Back-End DTI and choose the lowest one. We already
          figured out your Back-End DTI above, now we need to find Front-End DTI.
        </p>
      </div>

      {/* Front-End DTI Calculation */}
      <div className="bg-muted/30 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{fmt(grossMonthly)}/mo</p>
            <p className="text-xs text-muted-foreground">Your Gross Income</p>
          </div>
          <span className="text-xl font-bold text-muted-foreground">×</span>
          <div>
            <p className="text-2xl font-bold text-amber-600">{pct(activeTier.frontEndRatio)}</p>
            <p className="text-xs text-muted-foreground">Front-End DTI</p>
            <p className="text-[10px] text-muted-foreground italic">Limit</p>
          </div>
          <span className="text-xl font-bold text-muted-foreground">=</span>
          <div>
            <p className="text-2xl font-bold text-blue-600">{fmt(frontEndDtiNumber)}</p>
            <p className="text-xs text-muted-foreground">Front-End DTI Number</p>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          We just need to find the lowest number and that will be your maximum monthly mortgage payment:
        </p>

        <div className="bg-muted/30 rounded-xl p-6 flex flex-col items-center gap-4">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">
            Lowest
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            <div className={`p-4 rounded-lg border-2 ${backEndIsLowest ? 'border-primary bg-primary/5' : 'border-transparent'}`}>
              <p className="text-2xl font-bold text-purple-600">{fmt(backEndDtiNumber)}</p>
              <p className="text-xs text-muted-foreground">Back-End DTI Number</p>
              {backEndIsLowest && (
                <p className="text-[10px] text-primary mt-1 font-medium">
                  ☑ Since this number is the lowest, it will be used as your maximum housing payment.
                </p>
              )}
            </div>
            <span className="text-lg font-bold text-muted-foreground">{backEndIsLowest ? "<" : ">"}</span>
            <div className={`p-4 rounded-lg border-2 ${!backEndIsLowest ? 'border-primary bg-primary/5' : 'border-transparent'}`}>
              <p className="text-2xl font-bold text-blue-600">{fmt(frontEndDtiNumber)}</p>
              <p className="text-xs text-muted-foreground">Front-End DTI Number</p>
              {!backEndIsLowest && (
                <p className="text-[10px] text-primary mt-1 font-medium">
                  ☑ Since this number is the lowest, it will be used as your maximum housing payment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Max Housing Payment Must Include */}
      <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 text-center space-y-4">
        <p className="font-bold text-lg">
          The {fmt(activeTier.maxHousingPayment)}/mo maximum housing payment from above must include:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {[
            "Principal",
            "Interest",
            "Property Taxes",
            "Mortgage Insurance",
            "Homeowner's Insurance",
            "HOA Fees",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
