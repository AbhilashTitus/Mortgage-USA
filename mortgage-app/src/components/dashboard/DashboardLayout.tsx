"use client";

import dynamic from "next/dynamic";
import { useAffordabilityEngine } from "@/hooks/useAffordabilityEngine";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiskTier } from "@/lib/engine/types";
import { FaqSection } from "./FaqSection";
import { CustomPriceCalculator } from "./CustomPriceCalculator";
import { CLOSING_COST_OPTIONS } from "@/lib/engine/constants";

import Decimal from "decimal.js";

// ── Load all Recharts-based charts client-only to avoid SSR/animation loop ──
const PaymentBreakdownChart = dynamic(
  () => import("./PaymentBreakdownChart").then((m) => m.PaymentBreakdownChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const CashToCloseChart = dynamic(
  () => import("./CashToCloseChart").then((m) => m.CashToCloseChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const RiskTierComparison = dynamic(
  () => import("./RiskTierComparison").then((m) => m.RiskTierComparison),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export function DashboardLayout() {
  const results = useAffordabilityEngine();
  const { settings, updateSettings } = useAppStore();

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

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* ── Header row ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Affordability</h1>
          <p className="text-muted-foreground">Based on your inputs and current market rates.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Risk Tolerance:</span>
          <Select
            value={settings.selectedRiskTier}
            onValueChange={(v) => updateSettings({ selectedRiskTier: v as RiskTier })}
          >
            <SelectTrigger className="w-[180px]">
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

      {/* ── Hero summary ── */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Max Purchase Price</p>
              <p className="text-4xl font-bold tracking-tighter text-primary">
                ${activeTier.maxPurchasePrice.toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="space-y-1 md:border-x border-primary/10">
              <p className="text-sm font-medium text-muted-foreground">Monthly Payment (Total)</p>
              <p className="text-4xl font-bold tracking-tighter">
                ${activeTier.monthlyPayment.total.toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Cash to Close (Est.)</p>
              <p className="text-4xl font-bold tracking-tighter text-muted-foreground">
                ${cashToClose.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Tabs ── */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="theories">Theories</TabsTrigger>
          <TabsTrigger value="custom">Custom Price</TabsTrigger>
        </TabsList>

        {/* Payment + Cash-to-Close charts */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <PaymentBreakdownChart breakdown={activeTier.monthlyPayment} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cash to Close</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <CashToCloseChart
                  downPayment={activeTier.downPayment}
                  closingCosts={activeTier.maxPurchasePrice.times(
                    CLOSING_COST_OPTIONS[settings.closingCostOption] ?? new Decimal('0.025')
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk tier bar chart */}
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Tiers</CardTitle>
              <CardDescription>
                Compare how much you can afford across different risk levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <RiskTierComparison tiers={results.riskTiers} activeTier={activeTier.tier} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theories */}
        <TabsContent value="theories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Affordability Theories</CardTitle>
              <CardDescription>
                See how your numbers stack up against popular personal finance rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.theories.map((theory, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors flex flex-col">
                    <h3 className="font-bold text-lg mb-2">{theory.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">{theory.description}</p>
                    <div className="flex justify-between items-center border-t pt-4">
                      <span className="font-medium text-sm text-muted-foreground">Max Purchase Price</span>
                      <span className="font-bold text-xl text-primary">
                        ${theory.purchasePrice.toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom price */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test a Price</CardTitle>
              <CardDescription>See how a specific home price fits into your budget.</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomPriceCalculator key={settings.customPrice} comparison={results.customPriceComparison} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FaqSection />
    </div>
  );
}
