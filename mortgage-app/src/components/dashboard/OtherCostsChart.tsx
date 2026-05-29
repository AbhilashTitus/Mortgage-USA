"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PaymentBreakdown, OtherCosts } from "@/lib/engine/types";

interface OtherCostsChartProps {
  breakdown: PaymentBreakdown;
  otherCosts: OtherCosts;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

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
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            isAnimationActive={false}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) =>
              `$${Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
            }
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
