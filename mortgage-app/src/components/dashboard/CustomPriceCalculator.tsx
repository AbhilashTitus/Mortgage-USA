"use client";

import { useAppStore } from "@/lib/store";
import { CustomPriceComparison } from "@/lib/engine/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Decimal from "decimal.js";

interface CustomPriceCalculatorProps {
  comparison: CustomPriceComparison;
  tenKDifference: Decimal;
}

function fmt(val: Decimal, decimals = 0): string {
  return "$" + val.toNumber().toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function CustomPriceCalculator({ comparison, tenKDifference }: CustomPriceCalculatorProps) {
  const { settings, updateSettings } = useAppStore();
  const [inputValue, setInputValue] = useState(settings.customPrice.toString());

  const handleApply = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val <= 0) {
      updateSettings({ customPrice: 0 });
      setInputValue("");
    } else {
      updateSettings({ customPrice: val });
    }
  };

  const isZero = comparison.userPrice.isZero();

  // Compute difference for display
  const priceDiff = !isZero ? comparison.userBreakdown.total.minus(comparison.maxBreakdown.total) : new Decimal(0);
  const priceDiffAbs = priceDiff.abs();
  const dpPct = useAppStore.getState().userInputs.downPaymentPercent;
  const activeTierName = settings.selectedRiskTier;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header text */}
      <div className="text-sm leading-relaxed text-muted-foreground">
        <p className="font-bold text-lg text-foreground mb-2">
          Try it out! Enter your own price to see how it impacts your monthly payment:
        </p>
      </div>

      {/* Price input */}
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="customPrice">Enter a House Price ($)</Label>
          <Input
            id="customPrice"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Enter a price..."
          />
        </div>
        <Button onClick={handleApply}>Calculate</Button>
      </div>

      {/* Side-by-side comparison */}
      {!isZero && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: User Price */}
            <div className="p-6 rounded-xl bg-muted/30 border text-center space-y-4">
              <div>
                <p className="text-3xl font-bold text-purple-600">{fmt(comparison.userPrice)}</p>
                <p className="text-sm font-semibold mt-1">Enter Your Price</p>
                <p className="text-xs text-muted-foreground">{fmt(comparison.userDownPayment)} Down Payment ({dpPct}%)</p>
                <p className="text-xs text-muted-foreground">{fmt(comparison.userClosingCosts)} Estimated Closing Costs</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-2xl font-bold">{fmt(comparison.userBreakdown.total)}</p>
                <p className="text-sm font-semibold">Mortgage Payment</p>
                {priceDiff.lessThan(0) && (
                  <p className="text-xs text-green-600 font-medium">{fmt(priceDiffAbs)}/mo lower</p>
                )}
                {priceDiff.greaterThan(0) && (
                  <p className="text-xs text-red-500 font-medium">{fmt(priceDiffAbs)}/mo higher</p>
                )}
              </div>

              <div className="text-xs text-muted-foreground text-left space-y-0.5 px-4">
                <div className="flex justify-between"><span>P&I</span><span>{fmt(comparison.userBreakdown.principalAndInterest)}</span></div>
                <div className="flex justify-between"><span>Taxes</span><span>{fmt(comparison.userBreakdown.propertyTaxes)}</span></div>
                <div className="flex justify-between"><span>HOI</span><span>{fmt(comparison.userBreakdown.homeownersInsurance)}</span></div>
                <div className="flex justify-between"><span>MI</span><span>{fmt(comparison.userBreakdown.mortgageInsurance)}</span></div>
                <div className="flex justify-between"><span>HOA</span><span>{fmt(comparison.userBreakdown.hoa)}</span></div>
              </div>
            </div>

            {/* Right: Max Price */}
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center space-y-4">
              <div>
                <p className="text-3xl font-bold text-primary">{fmt(comparison.maxPrice)}</p>
                <p className="text-sm font-semibold mt-1">{activeTierName} Max Price</p>
                <p className="text-xs text-muted-foreground">{fmt(comparison.maxDownPayment)} Down Payment ({dpPct}%)</p>
                <p className="text-xs text-muted-foreground">{fmt(comparison.maxClosingCosts)} Estimated Closing Costs</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-2xl font-bold">{fmt(comparison.maxBreakdown.total)}</p>
                <p className="text-sm font-semibold">Mortgage Payment</p>
              </div>

              <div className="text-xs text-muted-foreground text-left space-y-0.5 px-4">
                <div className="flex justify-between"><span>P&I</span><span>{fmt(comparison.maxBreakdown.principalAndInterest)}</span></div>
                <div className="flex justify-between"><span>Taxes</span><span>{fmt(comparison.maxBreakdown.propertyTaxes)}</span></div>
                <div className="flex justify-between"><span>HOI</span><span>{fmt(comparison.maxBreakdown.homeownersInsurance)}</span></div>
                <div className="flex justify-between"><span>MI</span><span>{fmt(comparison.maxBreakdown.mortgageInsurance)}</span></div>
                <div className="flex justify-between"><span>HOA</span><span>{fmt(comparison.maxBreakdown.hoa)}</span></div>
              </div>
            </div>
          </div>

          {/* $10K diff indicator */}
          <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Your mortgage payment changes by approximately <strong className="text-foreground">{fmt(tenKDifference)}/mo</strong> per $10,000 change in purchase price.
            </p>
          </div>

          {/* Difference summary */}
          <div className={`p-4 rounded-lg border flex gap-3 ${
            comparison.userPrice.greaterThan(comparison.maxPrice)
              ? "bg-destructive/10 border-destructive/20"
              : "bg-primary/10 border-primary/20"
          }`}>
            <div>
              <p className="text-sm">{comparison.differenceText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
