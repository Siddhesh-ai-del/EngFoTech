import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  CheckSquare, 
  ExternalLink, 
  Lightbulb,
  ChevronRight,
  Rocket
} from 'lucide-react';
import { RoadmapStep } from '../types';
import { PageNavigation } from './PageNavigation';

interface RoadmapViewProps {
  roadmap: RoadmapStep[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap }) => {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-10 text-center space-y-2">
        <h2 className="text-3xl font-black text-dark-blue dark:text-white tracking-tighter leading-none">Strategic Roadmap</h2>
        <p className="text-dark-blue/40 dark:text-white/40 font-medium text-xs uppercase tracking-widest">A multi-phase structure to engineering excellence.</p>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-[20px] h-0.5 bg-slate-100 dark:bg-slate-800/10 hidden lg:block" />

        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-6 snap-x no-scrollbar">
          {roadmap.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative flex-shrink-0 w-full lg:w-[320px] snap-center"
            >
              <div className="hidden lg:flex absolute left-8 top-0 w-10 h-10 rounded-xl bg-dark-blue dark:bg-white shadow-lg items-center justify-center z-10">
                <Calendar size={18} className="text-white dark:text-dark-blue" />
              </div>

              <div className="lg:mt-12 glass-card !p-6 flex flex-col h-full hover:border-dark-blue dark:hover:border-white transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <span className="text-[8px] font-black text-dark-blue/30 dark:text-white/20 uppercase tracking-widest">{step.month}</span>
                    <h3 className="text-lg font-black text-dark-blue dark:text-white mt-0.5 tracking-tight leading-none">{step.milestone}</h3>
                  </div>
                  <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-dark-blue dark:text-white text-[8px] font-black rounded-full border border-slate-100 dark:border-slate-800 uppercase tracking-widest">
                    Phase {index + 1}
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-black text-dark-blue dark:text-white uppercase tracking-widest text-[9px]">
                      <CheckSquare size={14} className="text-dark-blue dark:text-white/40" />
                      Milestone Goals
                    </h4>
                    <ul className="space-y-2">
                      {step.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-dark-blue/80 dark:text-white/60 font-medium">
                          <ChevronRight size={14} className="text-dark-blue dark:text-white/40 shrink-0 mt-0.5" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {step.proTips && step.proTips.length > 0 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                      <h4 className="flex items-center gap-2 font-black text-dark-blue dark:text-white mb-2 text-[8px] uppercase tracking-widest">
                        <Lightbulb size={12} className="text-amber-500" />
                        AI Advisor Tips
                      </h4>
                      <ul className="space-y-1">
                        {step.proTips.map((tip, i) => (
                          <li key={i} className="text-[10px] text-dark-blue/70 dark:text-white/40 font-medium flex items-start gap-2">
                            <span className="text-dark-blue dark:text-white/20 font-black">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-black text-dark-blue dark:text-white uppercase tracking-widest text-[9px]">
                      <Rocket size={14} className="text-dark-blue dark:text-white/40" />
                      Portfolio Projects
                    </h4>
                    <div className="space-y-2">
                      {step.projects.map((project, i) => (
                        <div key={i} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] text-dark-blue/80 dark:text-white/60 font-black uppercase tracking-tight shadow-sm">
                          {project}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-black text-dark-blue dark:text-white uppercase tracking-widest text-[9px]">Curated Resources</h4>
                    <div className="space-y-2">
                      {step.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 hover:bg-dark-blue dark:hover:bg-white rounded-xl text-xs transition-all border border-slate-100 dark:border-transparent group"
                        >
                          <span className="text-dark-blue dark:text-white font-bold group-hover:text-white dark:group-hover:text-dark-blue text-[10px] truncate max-w-[120px]">{res.name}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded-md ${
                              res.type === 'free' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                            }`}>
                              {res.type}
                            </span>
                            <ExternalLink size={12} className="text-dark-blue/30 dark:text-white/20 group-hover:text-white dark:group-hover:text-dark-blue" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <PageNavigation />
    </div>
  );
};
