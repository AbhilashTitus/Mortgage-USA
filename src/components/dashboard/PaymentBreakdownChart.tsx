"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PaymentBreakdown } from '@/lib/engine/types';

interface PaymentBreakdownChartProps {
  breakdown: PaymentBreakdown;
}

const COLORS = ['#003087', '#0072C6', '#77BC1F', '#f59e0b', '#0ea5e9'];

export function PaymentBreakdownChart({ breakdown }: PaymentBreakdownChartProps) {
  const data = [
    { name: 'Principal & Interest', value: breakdown.principalAndInterest.toNumber() },
    { name: 'Property Taxes', value: breakdown.propertyTaxes.toNumber() },
    { name: 'Homeowners Insurance', value: breakdown.homeownersInsurance.toNumber() },
    { name: 'Mortgage Insurance', value: breakdown.mortgageInsurance.toNumber() },
    { name: 'HOA', value: breakdown.hoa.toNumber() },
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground text-sm p-6 text-center">
        <p className="font-semibold text-base mb-1 text-foreground">No breakdown available</p>
        <p className="text-xs max-w-[250px]">Your monthly payment under this scenario is $0.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
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
            formatter={(value: any) => `$${Number(value ?? 0).toLocaleString('en-US', {maximumFractionDigits: 0})}`}
          />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
