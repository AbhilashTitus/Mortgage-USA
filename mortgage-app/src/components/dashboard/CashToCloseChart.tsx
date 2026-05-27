"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Decimal from 'decimal.js';

interface CashToCloseChartProps {
  downPayment: Decimal;
  closingCosts: Decimal;
}

const COLORS = ['#0ea5e9', '#6366f1'];

export function CashToCloseChart({ downPayment, closingCosts }: CashToCloseChartProps) {
  const data = [
    { name: 'Down Payment', value: downPayment.toNumber() },
    { name: 'Closing Costs (Est.)', value: closingCosts.toNumber() },
  ].filter(item => item.value > 0);

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
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
            formatter={(value: any) => `$${Number(value ?? 0).toLocaleString('en-US', {maximumFractionDigits: 0})}`}
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
