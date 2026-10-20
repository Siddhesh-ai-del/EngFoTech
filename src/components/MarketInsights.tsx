import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';
import { MarketInsight } from '../types';
import { Card, SectionHeading } from './ui/Card';
import { Tag } from './ui/Tag';

interface MarketInsightsProps {
  insights: MarketInsight[];
}

const demandTone: Record<MarketInsight['demandLevel'], 'green' | 'orange' | 'neutral'> = {
  High: 'green',
  Medium: 'orange',
  Low: 'neutral',
};

export const MarketInsights: React.FC<MarketInsightsProps> = ({ insights }) => {
  const chartData = insights.map((i) => ({
    name: i.trendingSkill,
    growth: i.growthPercentage,
    salary: parseInt(i.salaryRange.split('-')[1]?.replace(/[^0-9]/g, '') || '20'),
  }));

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Market Insights"
        action={
          <Tag tone="green">
            <TrendingUp size={14} />
            Bullish
          </Tag>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, idx) => (
            <div key={idx} className="card p-4">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="p-2 bg-inset rounded-[10px] text-accent">
                  <Sparkles size={16} />
                </div>
                <Tag tone={demandTone[insight.demandLevel]}>{insight.demandLevel} Demand</Tag>
              </div>
              <h3 className="text-[17px] font-semibold text-label mb-3">{insight.trendingSkill}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="font-medium text-label-2">Salary Potential</span>
                  <span className="font-semibold text-label">{insight.salaryRange}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="font-medium text-label-2">Growth Rate</span>
                  <span className="font-semibold text-green-text">
                    +{insight.growthPercentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Salary Potential Chart */}
        <Card>
          <SectionHeading title="Salary potential (LPA)" level={3} className="mb-4" />
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="var(--lab-separator)"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--lab-label-2)' }}
                  width={90}
                />
                <Tooltip
                  cursor={{ fill: 'var(--lab-accent-fill)', fillOpacity: 0.06 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="card px-3 py-2 rounded-[10px] text-[13px]">
                          <p className="font-medium text-label-2">{payload[0].payload.name}</p>
                          <p className="font-semibold text-label">
                            {payload[0].value} LPA Potential
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="salary"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                  fill="var(--lab-accent-fill)"
                  animationDuration={300}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
