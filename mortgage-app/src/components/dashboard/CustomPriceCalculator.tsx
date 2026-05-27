"use client";

import { useAppStore } from "@/lib/store";
import { CustomPriceComparison } from "@/lib/engine/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface CustomPriceCalculatorProps {
  comparison: CustomPriceComparison;
}

export function CustomPriceCalculator({ comparison }: CustomPriceCalculatorProps) {
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

  const isOverMax = comparison.userPrice.greaterThan(comparison.maxPrice);
  const isZero = comparison.userPrice.isZero();

  return (
    <div className="w-full flex flex-col gap-6 p-4">
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="customPrice">Enter a House Price to Test ($)</Label>
          <Input 
            id="customPrice" 
            type="number" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
        </div>
        <Button onClick={handleApply}>Calculate</Button>
      </div>

      {!isZero && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className={`p-4 rounded-lg border flex gap-3 ${
            isOverMax ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-primary/10 border-primary/20 text-primary-foreground text-black dark:text-white'
          }`}>
            {isOverMax ? <AlertTriangle className="w-6 h-6 shrink-0 text-destructive" /> : <CheckCircle2 className="w-6 h-6 shrink-0 text-primary" />}
            <div>
              <h4 className="font-semibold">{isOverMax ? 'Over Budget' : 'Within Budget'}</h4>
              <p className="text-sm opacity-90">{comparison.differenceText}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Price</p>
              <p className="font-semibold text-lg">${comparison.userPrice.toNumber().toLocaleString('en-US', {maximumFractionDigits:0})}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Monthly</p>
              <p className="font-semibold text-lg">${comparison.userBreakdown.total.toNumber().toLocaleString('en-US', {maximumFractionDigits:0})}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Down Payment</p>
              <p className="font-semibold text-lg">${comparison.userDownPayment.toNumber().toLocaleString('en-US', {maximumFractionDigits:0})}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Closing Costs</p>
              <p className="font-semibold text-lg">${comparison.userClosingCosts.toNumber().toLocaleString('en-US', {maximumFractionDigits:0})}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
