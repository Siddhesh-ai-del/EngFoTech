import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, TrendingUp, Building2, Rocket, CheckCircle2, Sparkles } from 'lucide-react';
import { AnalysisResult } from '../types';

interface CareerOpportunitiesProps {
  analysis: AnalysisResult;
}

export const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ analysis }) => {
  if (!analysis.careerSummary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative mt-8"
    >
      <div className="relative glass-card !p-6 overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Sparkles size={80} className="text-dark-blue dark:text-white" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-dark-blue dark:text-white mb-1 tracking-tighter">Career Opportunities</h2>
            <p className="text-xs text-dark-blue/40 dark:text-white/40 font-medium uppercase tracking-widest">AI Synthesis Result</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-right">
              <p className="text-[8px] font-black text-dark-blue/40 dark:text-white/30 uppercase tracking-widest leading-none mb-1">Compatibility</p>
              <p className="text-xl font-black text-dark-blue dark:text-white leading-none">{analysis.careerSummary.compatibilityScore}%</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-dark-blue dark:bg-white flex items-center justify-center text-white dark:text-dark-blue shadow-sm">
              <CheckCircle2 size={16} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div>
              <h4 className="text-[9px] font-black text-dark-blue/30 dark:text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Briefcase size={12} />
                Recommended Roles
              </h4>
              <ul className="space-y-1.5">
                {analysis.careerSummary.recommendedRoles.map((role, i) => (
                  <li key={i} className="text-dark-blue/80 dark:text-white/60 font-medium flex items-center gap-2 text-xs">
                    <div className="w-1 h-1 rounded-full bg-dark-blue dark:bg-white/40" />
                    {role}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] font-black text-dark-blue/30 dark:text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                <TrendingUp size={12} />
                Market Trending
              </h4>
              <ul className="space-y-1.5">
                {analysis.careerSummary.trendingRoles.map((role, i) => (
                  <li key={i} className="text-dark-blue/80 dark:text-white/60 font-medium flex items-center gap-2 text-xs">
                    <div className="w-1 h-1 rounded-full bg-dark-blue dark:bg-white/40" />
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-[9px] font-black text-dark-blue/30 dark:text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Building2 size={12} />
                Focus Industries
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.careerSummary.suitableIndustries.map((ind, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-dark-blue/80 dark:text-white/40 rounded-md text-[8px] font-black border border-slate-100 dark:border-slate-700/50 uppercase tracking-widest">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[9px] font-black text-dark-blue/30 dark:text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Building2 size={12} />
                Target Companies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.careerSummary.hiringCompanies.map((comp, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-dark-blue/80 dark:text-white/40 rounded-md text-[8px] font-black border border-slate-100 dark:border-slate-700/50 uppercase tracking-widest">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-[8px] font-black text-dark-blue/30 dark:text-white/20 uppercase tracking-widest mb-2">Role Alignment</h4>
              <p className="text-[10px] text-dark-blue/60 dark:text-white/50 leading-relaxed italic font-medium">
                "{analysis.careerSummary.whyFit}"
              </p>
            </div>
            <div>
              <h4 className="text-[9px] font-black text-dark-blue/30 dark:text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Rocket size={12} />
                Strategic Steps
              </h4>
              <ul className="space-y-2">
                {analysis.careerSummary.nextSteps.map((step, i) => (
                  <li key={i} className="text-[10px] text-dark-blue/60 dark:text-white/40 font-medium flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 rounded-md bg-dark-blue dark:bg-white text-white dark:text-dark-blue flex items-center justify-center font-black text-[8px]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
