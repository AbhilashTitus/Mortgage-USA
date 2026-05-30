"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PaymentBreakdown, OtherCosts } from "@/lib/engine/types";

interface OtherCostsChartProps {
  breakdown: PaymentBreakdown;
  otherCosts: OtherCosts;
}

const COLORS = ["#003087", "#0072C6", "#0ea5e9", "#06b6d4", "#10b981", "#77BC1F", "#f59e0b"];

export function OtherCostsChart({ breakdown, otherCosts }: OtherCostsChartProps) {
  const data = [
    { name: "P&I", value: breakdown.principalAndInterest.toNumber() },
    { name: "Taxes", value: breakdown.propertyTaxes.toNumber() },
    { name: "HOI", value: breakdown.homeownersInsurance.toNumber() },
    { name: "MI", value: breakdown.mortgageInsurance.toNumber() },
    { name: "HOA", value: breakdown.hoa.toNumber() },
    { name: "Utilities", value: otherCosts.monthlyUtilities.toNumber() },
    { name: "Maintenance", value: otherCosts.monthlyMaintenance.toNumber() },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
        No costs to display
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="75%"
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={true}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            isAnimationActive={true}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) =>
              `$${Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
            }
          />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
