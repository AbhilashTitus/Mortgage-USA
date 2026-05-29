"use client";

import { PriceComparison } from "@/lib/engine/types";
import Decimal from "decimal.js";

interface PriceComparisonTableProps {
  comparisons: PriceComparison[];
  tenKDifference: Decimal;
}

function fmt(val: Decimal, decimals = 0): string {
  return "$" + val.toNumber().toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function PriceComparisonTable({ comparisons, tenKDifference }: PriceComparisonTableProps) {
  const baseline = comparisons.find((c) => c.scenarioName === "Baseline Price");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Comparing Home Offers</h2>
      </div>

      {/* Intro */}
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h3 className="text-lg font-bold text-foreground">How do different prices affect your monthly payment?</h3>
        <p>
          Shopping for a home can be stressful when you&apos;re unsure of how your monthly payment will be
          impacted by different price points. Here&apos;s an example of a few different price points that are close to
          the maximum of the risk level you select. Remember, you can always change this near the top of
          this sheet if you want to explore different risk levels.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="space-y-1">
        {/* Header */}
        <div className="hidden md:grid grid-cols-3 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div></div>
          <div className="text-center">Purchase Price</div>
          <div className="text-center">Mortgage Payment</div>
        </div>

        {comparisons.map((comp, idx) => {
          const isBaseline = comp.scenarioName === "Baseline Price";
          const diff = comp.paymentDifference;
          const diffAbs = diff.abs();

          let diffLabel = "";
          if (diff.greaterThan(0)) {
            diffLabel = `${fmt(diffAbs)} higher`;
          } else if (diff.lessThan(0)) {
            diffLabel = `${fmt(diffAbs)} lower`;
          }

          return (
            <div
              key={idx}
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-5 rounded-lg transition-colors ${
                isBaseline ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30"
              }`}
            >
              {/* Scenario Name */}
              <div className="flex items-center">
                <span className={`font-bold text-base ${isBaseline ? "text-primary" : ""}`}>
                  {comp.scenarioName}
                </span>
              </div>

              {/* Purchase Price + details */}
              <div className="text-center">
                <p className={`text-2xl font-bold ${isBaseline ? "text-primary" : "text-purple-600"}`}>
                  {fmt(comp.price)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmt(comp.downPayment)} Down Payment
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmt(comp.closingCosts)} Closing Costs
                </p>
              </div>

              {/* Mortgage Payment + diff */}
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {fmt(comp.mortgagePayment)}
                  {diffLabel && (
                    <span className={`text-sm font-semibold ml-2 ${
                      diff.greaterThan(0) ? "text-red-500" : "text-green-600"
                    }`}>
                      ({diffLabel})
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  + {fmt(comp.otherMonthlyCosts)}/mo of Other Costs
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* $10K Difference Section */}
      <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10 rounded-xl p-6 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          When you&apos;re looking at writing an offer on a home you like, you might need a quick estimate of how
          much your mortgage payment will change with different purchase prices. Based on your info, your
          mortgage payment will change by about <strong className="text-foreground">{fmt(tenKDifference)}/mo</strong> per $10,000 change in purchase price.
        </p>
        <div className="flex items-center gap-4">
          <p className="text-4xl font-bold text-primary">{fmt(tenKDifference)}/mo</p>
          <div>
            <span className="text-xl text-muted-foreground">←</span>{" "}
            <span className="text-sm font-semibold">
              Estimated Change In Mortgage Payment Per $10,000 Change In Purchase Price
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
