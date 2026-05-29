"use client";

import { RiskTierResult, ClosingCostOption } from "@/lib/engine/types";
import { useAppStore } from "@/lib/store";
import { CLOSING_COST_OPTIONS } from "@/lib/engine/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Decimal from "decimal.js";

interface DownPaymentClosingCostsProps {
  activeTier: RiskTierResult;
}

function fmt(val: Decimal | number, decimals = 0): string {
  const n = typeof val === "number" ? val : val.toNumber();
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function DownPaymentClosingCosts({ activeTier }: DownPaymentClosingCostsProps) {
  const { settings, updateSettings, userInputs } = useAppStore();

  const closingCostRate = CLOSING_COST_OPTIONS[settings.closingCostOption] ?? new Decimal("0.025");
  const closingCosts = activeTier.maxPurchasePrice.times(closingCostRate);
  const cashToClose = activeTier.downPayment.plus(closingCosts);
  const downPaymentPct = userInputs.downPaymentPercent;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Down Payment &amp; Closing Costs</h2>
      </div>

      {/* Equation Layout */}
      <div className="bg-muted/30 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">{fmt(activeTier.downPayment)}</p>
            <p className="text-sm font-semibold">Down Payment</p>
            <p className="text-xs text-muted-foreground italic">{downPaymentPct}% Down Payment</p>
          </div>
          <span className="text-2xl font-bold text-muted-foreground">+</span>
          <div>
            <p className="text-3xl font-bold text-amber-600">{fmt(closingCosts)}</p>
            <p className="text-sm font-semibold">Closing Costs</p>
            <div className="mt-1">
              <Select
                value={settings.closingCostOption}
                onValueChange={(v) => updateSettings({ closingCostOption: v as ClosingCostOption })}
              >
                <SelectTrigger className="h-7 text-xs w-auto min-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CLOSING_COST_OPTIONS).map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <span className="text-2xl font-bold text-muted-foreground">=</span>
          <div>
            <p className="text-3xl font-bold">{fmt(cashToClose)}</p>
            <p className="text-sm font-semibold">Cash To Close</p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="text-sm leading-relaxed text-muted-foreground space-y-3">
        <p>
          Based on the risk level you chose near the top of this sheet (<strong className="text-foreground">{activeTier.tier}</strong>) the maximum purchase
          price of <strong className="text-foreground">{fmt(activeTier.maxPurchasePrice)}</strong> will have a down payment of <strong className="text-foreground">{fmt(activeTier.downPayment)}</strong>. This is based on the down payment
          percentage you chose in the Your Info section. Cash To Close in the mortgage world means the total
          amount of money that you will need to bring to the closing table.
        </p>
      </div>
    </div>
  );
}
