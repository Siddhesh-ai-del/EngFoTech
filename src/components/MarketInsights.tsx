import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, DollarSign, Activity, Sparkles } from 'lucide-react';
import { MarketInsight } from '../types';

interface MarketInsightsProps {
  insights: MarketInsight[];
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ insights }) => {
  const chartData = insights.map(i => ({
    name: i.trendingSkill,
    growth: i.growthPercentage,
    salary: parseInt(i.salaryRange.split('-')[1]?.replace(/[^0-9]/g, '') || '20')
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black text-dark-blue dark:text-white tracking-tight flex items-center gap-2 uppercase tracking-widest">
          <Activity className="text-dark-blue dark:text-white/40" size={16} />
          Market Insights
        </h2>
        <div className="flex gap-2">
           <div className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black rounded-md border border-emerald-100 dark:border-emerald-500/20 uppercase tracking-widest flex items-center gap-1">
             <TrendingUp size={10} />
             Bullish
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="glass-card !p-4 group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-dark-blue dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-dark-blue transition-colors">
                  <Sparkles size={14} />
                </div>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest ${
                  insight.demandLevel === 'High' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 
                  insight.demandLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400'
                }`}>
                  {insight.demandLevel} Demand
                </span>
              </div>
              <h4 className="text-sm font-black text-dark-blue dark:text-white mb-0.5">{insight.trendingSkill}</h4>
              <div className="space-y-1 mt-2">
                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-dark-blue/40 dark:text-white/20">
                  <span>Salary Potential</span>
                  <span className="text-dark-blue dark:text-white/60">{insight.salaryRange}</span>
                </div>
                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-dark-blue/40 dark:text-white/20">
                  <span>Growth Rate</span>
                  <span className="text-emerald-500">+{insight.growthPercentage}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Salary Potential Chart */}
        <div className="glass-card !p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[9px] font-black text-dark-blue/60 dark:text-white/40 uppercase tracking-widest">Salary potential (LPA)</h3>
            </div>
            <DollarSign size={14} className="text-dark-blue/20 dark:text-white/20" />
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 8, fontWeight: 900, fill: 'var(--color-chart-text)' }}
                  width={60}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--color-dark-blue)', fillOpacity: 0.05 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-dark-blue dark:bg-slate-800 p-2 rounded-lg shadow-xl border border-white/10">
                          <p className="text-white text-[8px] font-black uppercase">{payload[0].payload.name}</p>
                          <p className="text-white/60 text-[7px] font-black">{payload[0].value} LPA Potential</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="salary" radius={[0, 4, 4, 0]} barSize={12}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--color-dark-blue)' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
