"use client";

import { ClientOnly } from "@/components/ClientOnly";
import { PaymentBreakdownChart } from "./PaymentBreakdownChart";
import { CashToCloseChart } from "./CashToCloseChart";
import { RiskTierComparison } from "./RiskTierComparison";
import { useAffordabilityEngine } from "@/hooks/useAffordabilityEngine";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiskTier } from "@/lib/engine/types";
import { FaqSection } from "./FaqSection";
import { CustomPriceCalculator } from "./CustomPriceCalculator";
import { DtiExplanation } from "./DtiExplanation";
import { DownPaymentClosingCosts } from "./DownPaymentClosingCosts";
import { PriceComparisonTable } from "./PriceComparisonTable";
import { OtherMonthlyCosts } from "./OtherMonthlyCosts";
import { AmortizationTable } from "./AmortizationTable";
import { CLOSING_COST_OPTIONS } from "@/lib/engine/constants";
import { AlertTriangle, Star, ArrowRight, RotateCcw } from "lucide-react";
import Decimal from "decimal.js";

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("The width(-1) and height(-1)")) return;
    originalWarn(...args);
  };
}

function ChartSkeleton() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function fmt(val: Decimal, decimals = 0): string {
  return "$" + val.toNumber().toLocaleString("en-US", { maximumFractionDigits: decimals });
}

import { DashboardTab } from "@/app/page";

interface DashboardLayoutProps {
  activeTab: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
  onReturnToOverview?: () => void;
}

export function DashboardLayout({ activeTab, onTabChange, onReturnToOverview }: DashboardLayoutProps) {
  const results = useAffordabilityEngine();
  const { settings, updateSettings, userInputs } = useAppStore();

  if (!results) {
    return (
      <div className="flex h-full min-h-[600px] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const activeTier = results.riskTiers.find(t => t.tier === settings.selectedRiskTier) || results.riskTiers[2];

  const closingCostOptionDecimal = CLOSING_COST_OPTIONS[settings.closingCostOption] ?? new Decimal('0.025');
  const cashToClose =
    activeTier.downPayment.toNumber() +
    activeTier.maxPurchasePrice.toNumber() * closingCostOptionDecimal.toNumber();

  const grossMonthly = (userInputs.yearlyGrossIncome + userInputs.coBorrowerIncome) / 12;
  const totalDebts = userInputs.borrowerDebts.reduce((a, b: any) => a + (typeof b === "number" ? b : (b?.amount || 0)), 0) + userInputs.coBorrowerDebts.reduce((a, b: any) => a + (typeof b === "number" ? b : (b?.amount || 0)), 0);

  const isDebtOverLimit = activeTier.maxPurchasePrice.isZero() && grossMonthly > 0 && totalDebts > 0;
  
  // Calculate specific figures for warning banner
  const backEndLimitPct = activeTier.backEndRatio.times(100).toNumber();
  const maxAllowedDebts = grossMonthly * activeTier.backEndRatio.toNumber();
  const excessDebts = totalDebts - maxAllowedDebts;
  const requiredIncomeForDebts = (totalDebts / activeTier.backEndRatio.toNumber()) * 12;
  const incomeShortfall = requiredIncomeForDebts - (userInputs.yearlyGrossIncome + userInputs.coBorrowerIncome);

  // Check if any higher-risk tier could qualify
  const alternativeTier = results.riskTiers.find(t => t.maxPurchasePrice.greaterThan(0));

  // Find the conservative tier for theory "suggested maximum"
  const conservativeTier = results.riskTiers.find(t => t.tier === "Conservative");

  return (
    <div className="flex flex-col gap-4 sm:gap-6 h-full pb-24 lg:pb-8">
      {/* ── Header row ── */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Affordability Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Based on your inputs and current market rates.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap">Risk Tolerance:</span>
          <Select
            value={settings.selectedRiskTier}
            onValueChange={(v) => updateSettings({ selectedRiskTier: v as RiskTier })}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select risk tier" />
            </SelectTrigger>
            <SelectContent>
              {results.riskTiers.map(tier => (
                <SelectItem key={tier.tier} value={tier.tier}>
                  {tier.tier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Warning Alert (when debts exceed limits) ── */}
      {isDebtOverLimit && (
        <div className="p-3 sm:p-5 border border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200 rounded-xl flex gap-3 sm:gap-4 items-start animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertTriangle className="w-6 h-6 shrink-0 text-amber-500 mt-0.5 animate-pulse" />
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg leading-none">Monthly Debts Exceed DTI Limit</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Your monthly debts of <strong>${totalDebts.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong> exceed the maximum total debt allowed for your income level under the <strong>{settings.selectedRiskTier}</strong> risk tier. 
              The maximum monthly debt allowed for this tier is <strong>{backEndLimitPct}%</strong> of your gross monthly income (which equals <strong>${maxAllowedDebts.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong>).
            </p>
            <div className="text-sm opacity-90 space-y-2 pt-1 border-t border-amber-500/10 mt-2">
              <p className="font-semibold text-amber-950 dark:text-amber-100">To qualify for a mortgage, you would need to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Reduce monthly debts:</strong> Lower your minimum monthly payments by at least <strong>${excessDebts.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong> to bring them under the limit.
                </li>
                <li>
                  <strong>Increase income:</strong> Increase your annual gross income to at least <strong>${requiredIncomeForDebts.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong> (an increase of <strong>${incomeShortfall.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong>).
                </li>
                {alternativeTier ? (
                  <li>
                    <strong>Try a higher risk tolerance:</strong> Choose the <strong>{alternativeTier.tier}</strong> risk tier at the top right, which allows a higher debt-to-income ratio.
                  </li>
                ) : (
                  <li>
                    <strong>Exceeds all limits:</strong> Your debts exceed the limit of even the most aggressive risk tier (Risky tier, 55% back-end DTI limit). You will need to reduce debts or increase income to qualify.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero summary ── */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Max Purchase Price</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-primary">
                ${activeTier.maxPurchasePrice.toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="space-y-1 sm:border-x border-primary/10">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Monthly Payment (Total)</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">
                ${activeTier.monthlyPayment.total.toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Cash to Close (Est.)</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-muted-foreground">
                ${cashToClose.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} className="w-full">
        {/* Horizontal TabsList removed; Navigation is now handled by the sidebar */}
        <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-500 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ClientOnly fallback={<ChartSkeleton />}>
                  <PaymentBreakdownChart breakdown={activeTier.monthlyPayment} />
                </ClientOnly>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cash to Close</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ClientOnly fallback={<ChartSkeleton />}>
                  <CashToCloseChart
                    downPayment={activeTier.downPayment}
                    closingCosts={activeTier.maxPurchasePrice.times(
                      CLOSING_COST_OPTIONS[settings.closingCostOption] ?? new Decimal('0.025')
                    )}
                  />
                </ClientOnly>
              </CardContent>
            </Card>
          </div>

          <div className="p-5 bg-muted/30 rounded-xl border">
            <h2 className="text-lg font-bold mb-2">
              Lenders will usually approve you for MORE than you should buy...
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Lenders don&apos;t just guess at how much of a loan they&apos;ll approve you for. They base it off of a formula
              called the Debt-To-Income ratio. Most loans will allow a much higher Debt-To-Income ratio than you
              should take on. We suggest you stick to the Conservative option as your maximum purchase price so you don&apos;t struggle
              to make a mortgage payment.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <DownPaymentClosingCosts activeTier={activeTier} />
            </CardContent>
          </Card>

          <AmortizationTable />

          {/* Next Step CTA */}
          <div className="mt-12 flex justify-center pb-24">
            <button
              onClick={() => {
                onTabChange?.("scenarios");
              }}
              className="group relative px-8 py-4 bg-[#003087] hover:bg-[#002266] text-white rounded-full shadow-xl transition-all duration-300 flex items-center gap-3 overflow-hidden outline-none ring-4 ring-[#003087]/20 hover:ring-[#003087]/40"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 font-bold text-lg tracking-wide">Explore Scenarios</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="scenarios" className="space-y-6 animate-in fade-in duration-500">
          <Card>
            <CardHeader>
              <CardTitle>Risk Tiers</CardTitle>
              <CardDescription>
                Compare how much you can afford across different risk levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ClientOnly fallback={<ChartSkeleton />}>
                <RiskTierComparison tiers={results.riskTiers} activeTier={activeTier.tier} />
              </ClientOnly>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <PriceComparisonTable
                comparisons={results.priceComparisons}
                tenKDifference={results.tenKDifference}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Test a Price</CardTitle>
              <CardDescription>See how a specific home price fits into your budget.</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomPriceCalculator
                key={settings.customPrice}
                comparison={results.customPriceComparison}
                tenKDifference={results.tenKDifference}
              />
            </CardContent>
          </Card>

          {/* Next Step CTA */}
          <div className="mt-12 flex justify-center pb-24">
            <button
              onClick={() => {
                onTabChange?.("deep-dive");
              }}
              className="group relative px-8 py-4 bg-[#003087] hover:bg-[#002266] text-white rounded-full shadow-xl transition-all duration-300 flex items-center gap-3 overflow-hidden outline-none ring-4 ring-[#003087]/20 hover:ring-[#003087]/40"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 font-bold text-lg tracking-wide">Deep Dive Details</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="deep-dive" className="space-y-6 animate-in fade-in duration-500">
          <Card>
            <CardContent className="p-6">
              <DtiExplanation activeTier={activeTier} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-4 sm:px-6 pt-5 sm:pt-6 pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight">Popular Affordability Theories</CardTitle>
              <CardDescription className="space-y-2 text-[13px] sm:text-sm leading-normal sm:leading-relaxed text-slate-500 max-w-2xl">
                <span>
                  Different financial experts give their &quot;rules of thumb&quot; for your maximum mortgage payment.
                  Here are a few popular theories so you can see how they stack up to our recommended maximum:
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-5 sm:pb-6">
              {/* Suggested Maximum Banner */}
              {conservativeTier && (
                <div className="mb-6 p-4 sm:p-5 bg-primary/5 border-2 border-primary/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      <Star className="w-3 h-3" /> SUGGESTED MAXIMUM
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">Conservative</h3>
                      <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                        {conservativeTier.frontEndRatio.times(100).toNumber()}%/{conservativeTier.backEndRatio.times(100).toNumber()}%
                      </p>
                    </div>
                    <div className="text-right sm:text-center">
                      <p className="text-xl sm:text-2xl font-black text-primary tracking-tight">{fmt(conservativeTier.maxPurchasePrice)}</p>
                      <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">{fmt(conservativeTier.downPayment)} down</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{fmt(conservativeTier.monthlyPayment.total)}</p>
                      <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">{conservativeTier.percentOfNetIncome.toNumber()}% of net income</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DISCLAIMER */}
              <div className="mb-6 text-xs text-muted-foreground italic border-l-2 border-muted-foreground/20 pl-3">
                <strong>DISCLAIMER:</strong> mortgage approvals involve layers of risk analysis that determine your
                max purchase price. This calculator cannot qualify you for a mortgage. It is only an
                educational exercise in learning about debt-to-income ratios.
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {results.theories.map((theory, idx) => (
                  <div key={idx} className="p-5 sm:p-6 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="text-center mb-5">
                      <h3 className="font-bold text-lg sm:text-xl text-slate-800 mb-1">{theory.name}</h3>
                      <p className="text-3xl sm:text-4xl font-black text-primary tracking-tight">{fmt(theory.purchasePrice)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">Monthly Payment</span>
                        <span className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">{fmt(theory.monthlyPayment)}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">Down Payment</span>
                        <span className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">{fmt(theory.downPayment)}</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4 flex-1">
                      <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Theory Background</p>
                      <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed sm:leading-relaxed">{theory.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <OtherMonthlyCosts activeTier={activeTier} otherCosts={results.otherCosts} />
            </CardContent>
          </Card>

          {/* Next Step CTA */}
          <div className="mt-12 flex justify-center pb-24">
            <button
              onClick={() => {
                onReturnToOverview?.();
              }}
              className="group relative px-8 py-4 bg-white hover:bg-slate-50 border-2 border-[#003087] text-[#003087] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 overflow-hidden outline-none"
            >
              <RotateCcw className="relative z-10 w-5 h-5 group-hover:-rotate-90 transition-transform duration-500" />
              <span className="relative z-10 font-bold text-lg tracking-wide">Back to Overview</span>
            </button>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Footer FAQ ── */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <FaqSection />
      </div>
    </div>
  );
}
