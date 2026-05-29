"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RiskTierResult } from '@/lib/engine/types';

interface RiskTierComparisonProps {
  tiers: RiskTierResult[];
  activeTier: string;
}

const TIER_COLORS: Record<string, string> = {
  'Safe': '#10b981',
  'Conservative': '#84cc16',
  'Moderate': '#f59e0b',
  'Aggressive': '#f97316',
  'Risky': '#ef4444',
};

export function RiskTierComparison({ tiers, activeTier }: RiskTierComparisonProps) {
  const data = tiers.map(t => ({
    name: t.tier,
    maxPrice: t.maxPurchasePrice.toNumber(),
  }));

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number" 
            tickFormatter={(value) => `$${(value / 1000)}k`}
          />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip 
            isAnimationActive={true}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => `$${Number(value ?? 0).toLocaleString('en-US', {maximumFractionDigits: 0})}`}
            labelStyle={{ color: 'black', fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Bar dataKey="maxPrice" radius={[0, 8, 8, 0]} isAnimationActive={true}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={TIER_COLORS[entry.name]} 
                opacity={entry.name === activeTier ? 1 : 0.6}
                stroke={entry.name === activeTier ? '#000' : 'none'}
                strokeWidth={entry.name === activeTier ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
