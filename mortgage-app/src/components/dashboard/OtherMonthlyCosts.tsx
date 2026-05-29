"use client";

import { RiskTierResult, OtherCosts, UtilityLevel, MaintenanceLevel } from "@/lib/engine/types";
import { useAppStore } from "@/lib/store";
import { UTILITY_COSTS_PER_SQFT, MAINTENANCE_RATES } from "@/lib/engine/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import Decimal from "decimal.js";
import { OtherCostsChart } from "./OtherCostsChart";

interface OtherMonthlyCostsProps {
  activeTier: RiskTierResult;
  otherCosts: OtherCosts;
}

function fmt(val: Decimal | number, decimals = 0): string {
  const n = typeof val === "number" ? val : val.toNumber();
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function OtherMonthlyCosts({ activeTier, otherCosts }: OtherMonthlyCostsProps) {
  const { settings, updateSettings } = useAppStore();

  const utilityRateLabel = UTILITY_COSTS_PER_SQFT[settings.utilityLevel]?.toString() || "0.10";
  const maintenanceRateLabel = MAINTENANCE_RATES[settings.maintenanceLevel]?.times(100).toString() || "0.5";

  const mortgagePayment = activeTier.monthlyPayment;
  const otherCostsTotal = otherCosts.monthlyUtilities.plus(otherCosts.monthlyMaintenance);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Other Monthly Costs</h2>
      </div>

      {/* Intro */}
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h3 className="text-lg font-bold text-foreground">Don&apos;t forget the other costs of buying a home!</h3>
        <p>
          A lender might approve you with a maximum purchase price of <strong className="text-foreground">{fmt(activeTier.maxPurchasePrice)}</strong>, but should you buy a
          home at that price? Just because you&apos;re approved for a home doesn&apos;t mean you can actually afford
          it. Lenders are ONLY worried about the statistical likelihood of you paying back a loan, not what is
          actually financially healthy for you.
        </p>
        <p>
          Don&apos;t forget that when you own a home you&apos;re not just paying the mortgage payment. You&apos;re also
          paying utilities and it&apos;s suggested that you set aside money each month for maintenance and
          repairs. Let&apos;s take a look at the {activeTier.tier} maximum purchase price to see what the monthly
          payment looks like. If you buy a home at a price of {fmt(activeTier.maxPurchasePrice)}, not only would you need to have
          a down payment of {fmt(activeTier.downPayment)} (you can change this on 2. Your Info) but also be able to pay {fmt(mortgagePayment.total)} to the
          lender each month. Not to mention utilities, repairs, etc.
        </p>
        <p className="italic">Here&apos;s a quick way to estimate the other costs.</p>
      </div>

      {/* Estimator + Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Other Costs Estimator */}
        <div className="space-y-4">
          <h4 className="font-bold text-base">Other Costs Estimator</h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-sm whitespace-nowrap">Estimated Square Footage</Label>
              <Input
                type="number"
                className="w-32 text-right"
                value={settings.estimatedSqFt}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) updateSettings({ estimatedSqFt: val });
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label className="text-sm whitespace-nowrap">Utility Cost Per Square Foot</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={settings.utilityLevel}
                  onValueChange={(v) => updateSettings({ utilityLevel: v as UtilityLevel })}
                >
                  <SelectTrigger className="w-28 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground whitespace-nowrap">${utilityRateLabel}/SqFt</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label className="text-sm whitespace-nowrap">Maintenance Savings Per Year</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={settings.maintenanceLevel}
                  onValueChange={(v) => updateSettings({ maintenanceLevel: v as MaintenanceLevel })}
                >
                  <SelectTrigger className="w-28 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{maintenanceRateLabel}% of Purchase Price/Yr</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground italic">As a percentage of the purchase price</p>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="h-[280px]">
          <OtherCostsChart breakdown={mortgagePayment} otherCosts={otherCosts} />
        </div>
      </div>

      {/* Equation: Mortgage + Other = Total */}
      <div className="bg-muted/30 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{fmt(mortgagePayment.total)}</p>
            <p className="text-sm font-semibold">Mortgage Payment</p>
            <div className="mt-2 text-xs text-muted-foreground text-left space-y-0.5 min-w-[140px]">
              <div className="flex justify-between"><span>P&I</span><span>{fmt(mortgagePayment.principalAndInterest)}</span></div>
              <div className="flex justify-between"><span>Taxes</span><span>{fmt(mortgagePayment.propertyTaxes)}</span></div>
              <div className="flex justify-between"><span>HOI</span><span>{fmt(mortgagePayment.homeownersInsurance)}</span></div>
              <div className="flex justify-between"><span>MI</span><span>{fmt(mortgagePayment.mortgageInsurance)}</span></div>
              <div className="flex justify-between"><span>HOA</span><span>{fmt(mortgagePayment.hoa)}</span></div>
            </div>
          </div>

          <span className="text-2xl font-bold text-muted-foreground">+</span>

          <div>
            <p className="text-2xl font-bold text-amber-600">{fmt(otherCostsTotal)}</p>
            <p className="text-sm font-semibold">Other Costs</p>
            <div className="mt-2 text-xs text-muted-foreground text-left space-y-0.5 min-w-[140px]">
              <div className="flex justify-between"><span>Utilities</span><span>{fmt(otherCosts.monthlyUtilities)}</span></div>
              <div className="flex justify-between"><span>Maintenance</span><span>{fmt(otherCosts.monthlyMaintenance)}</span></div>
            </div>
          </div>

          <span className="text-2xl font-bold text-muted-foreground">=</span>

          <div>
            <p className="text-2xl font-bold">{fmt(otherCosts.totalMonthlyCost)}</p>
            <p className="text-sm font-semibold">Estimated Total</p>
            <p className="text-sm font-semibold">Monthly Cost</p>
          </div>
        </div>

        {/* Warning Badge */}
        {otherCosts.warning && (
          <div className="mt-4 flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium">
              This is {otherCosts.percentOfTakeHome.toString()}% of your take home pay of {fmt(otherCosts.netMonthlyIncome)}/mo
            </span>
          </div>
        )}
      </div>

      {/* Bottom Paragraph */}
      <div className="text-sm leading-relaxed text-muted-foreground">
        <p>
          Can you afford to spend {fmt(otherCosts.totalMonthlyCost)}/mo on a home? Keep in mind that your take home pay after taxes is
          around {fmt(otherCosts.netMonthlyIncome)}/mo. So, after taxes and paying your mortgage + other costs you&apos;d have {fmt(otherCosts.remainingIncome)} left over
          for ALL your other expenses (e.g. groceries, gas, bills, etc.). It&apos;s ok if that doesn&apos;t work for you. Only
          YOU can decide what you&apos;re comfortable spending on a home. Rules of thumb for affordability can
          only get you so far. Having a strong grasp on your budget is the best way to actually know what you
          can afford.
        </p>
      </div>
    </div>
  );
}
