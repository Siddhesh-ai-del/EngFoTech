import React from 'react';
import { motion } from 'motion/react';
import { Star, TrendingUp, Zap } from 'lucide-react';
import { SkillGap } from '../types';

interface SkillGapAnalyzerProps {
  skillGaps: SkillGap[];
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ skillGaps }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black text-dark-blue dark:text-white tracking-tight flex items-center gap-2 uppercase tracking-widest">
          <Zap className="text-dark-blue dark:text-white/40" size={16} />
          Skill Gaps
        </h2>
        <div className="text-[9px] font-black text-dark-blue/40 dark:text-white/20 uppercase tracking-widest flex items-center gap-2">
          <Star size={12} className="text-amber-400" />
          AI Analysis
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillGaps.map((gap, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * idx }}
            className="glass-card !p-5 relative overflow-hidden group border-slate-200/50"
          >
            {gap.priority === 'High' && (
              <div className="absolute top-0 right-0 p-3">
                <div className="px-2 py-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[7px] font-black rounded-md border border-rose-100 dark:border-rose-500/20 uppercase tracking-widest">
                  Critical
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {gap.missingSkills.map((skill, i) => (
                  <span key={i} className="text-lg font-black text-dark-blue dark:text-white truncate">{skill}</span>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-dark-blue/40 dark:text-white/20">
                  <span>Priority</span>
                  <span className={gap.priority === 'High' ? 'text-rose-500' : 'text-amber-500'}>{gap.priority}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-dark-blue/40 dark:text-white/20">
                    <span>Difficulty</span>
                    <span>{gap.difficulty}/10</span>
                  </div>
                  <div className="h-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${gap.difficulty * 10}%` }}
                      className="h-full bg-dark-blue dark:bg-white" 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 italic text-[10px] text-dark-blue/60 dark:text-white/40">
                  <TrendingUp size={12} className="text-dark-blue/30 dark:text-white/20" />
                  Time: {gap.estimatedTime}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
