import { useAppStore } from "@/lib/store";
import { useAffordabilityEngine } from "@/hooks/useAffordabilityEngine";
import { generateAmortizationSchedule } from "@/lib/engine/mortgage";
import Decimal from "decimal.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMemo } from "react";

export function AmortizationTable() {
  const { settings, userInputs } = useAppStore();
  const results = useAffordabilityEngine();

  const schedule = useMemo(() => {
    if (!results) return [];
    const activeTier = results.riskTiers.find(t => t.tier === settings.selectedRiskTier) || results.riskTiers[2];
    
    const loanAmount = activeTier.maxPurchasePrice.minus(activeTier.downPayment);
    const rate = userInputs.interestRate;
    const term = userInputs.mortgageTermYears;
    const pmt = activeTier.monthlyPayment.principalAndInterest;

    return generateAmortizationSchedule(loanAmount, rate, term, pmt);
  }, [results, settings.selectedRiskTier, userInputs]);

  if (schedule.length === 0) return null;

  return (
    <Card className="w-full shadow-xl rounded-2xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-primary font-semibold">Amortization Details (Yearly)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto styled-scrollbar rounded-b-2xl">
          <table className="w-full text-sm text-left border-collapse relative">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-100 text-slate-700 border-b-2 border-slate-200 shadow-sm">
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Principal Paid</th>
                <th className="px-4 py-3 font-semibold">Interest Charged</th>
                <th className="px-4 py-3 font-semibold">Total Payment</th>
                <th className="px-4 py-3 font-semibold">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, idx) => (
                <tr 
                  key={row.year} 
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{row.year}</td>
                  <td className="px-4 py-3 text-slate-600">${row.principalPaid.toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                  <td className="px-4 py-3 text-slate-600">${row.interestCharged.toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                  <td className="px-4 py-3 text-slate-600">${row.totalPayment.toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                  <td className="px-4 py-3 font-medium text-primary">${row.remainingBalance.toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
