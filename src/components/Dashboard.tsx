import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase,
  GraduationCap,
  Building2,
  Rocket,
  Sparkles,
  ArrowRight,
  Download,
  Code2,
  LineChart,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  Target,
  TrendingUp,
  Award,
  Database,
  ShieldCheck,
  Cpu,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { AnalysisResult } from '../types';
import { CareerOpportunities } from './CareerOpportunities';
import { PageNavigation } from './PageNavigation';

import { MarketInsights } from './MarketInsights';
import { MentorChat } from './MentorChat';
import { SkillGapAnalyzer } from './SkillGapAnalyzer';
import { SystemDesignPath } from './SystemDesignPath';

interface DashboardProps {
  analysis: AnalysisResult;
}

const CollapsibleAdvice: React.FC<{ title: string; content: string; icon: React.ReactNode; preview?: string }> = ({ title, content, icon, preview }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass-card !p-5 hover:shadow-xs transition-all duration-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-dark-blue dark:text-slate-400 group-hover:bg-dark-blue dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-dark-blue transition-colors">
            {icon}
          </div>
          <h3 className="font-black text-dark-blue dark:text-white uppercase tracking-widest text-[9px] text-left">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {!isOpen && preview && (
        <p className="text-[10px] text-dark-blue/40 font-bold mt-4 uppercase tracking-widest line-clamp-1">{preview}</p>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-dark-blue/80 leading-relaxed font-medium mt-6 pt-6 border-t border-slate-50 whitespace-pre-wrap">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ analysis }) => {
  const navigate = useNavigate();
  const { targetJobs, recommendedSkills, strategicAdvice, strategicMetrics } = analysis;

  const chartData = [
    { subject: 'Skills', value: strategicMetrics?.skills ?? 85, fullMark: 100, hint: 'Technical & Soft Skills' },
    { subject: 'Interests', value: strategicMetrics?.interests ?? 80, fullMark: 100, hint: 'Passion & Curiosity' },
    { subject: 'Academia', value: strategicMetrics?.academicPerformance ?? 75, fullMark: 100, hint: 'CGPA & Coursework' },
    { subject: 'Strategy', value: strategicMetrics?.strategy ?? 70, fullMark: 100, hint: 'Career Planning' },
    { subject: 'Demand', value: strategicMetrics?.marketDemand ?? 90, fullMark: 100, hint: 'Job Market Growth' },
  ];
  const getJobIcon = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('software') || lowerRole.includes('developer') || lowerRole.includes('engineer')) return Code2;
    if (lowerRole.includes('data') || lowerRole.includes('analyst')) return LineChart;
    if (lowerRole.includes('product') || lowerRole.includes('manager')) return Target;
    if (lowerRole.includes('design') || lowerRole.includes('ui')) return Lightbulb;
    return Briefcase;
  };

  const getSkillIcon = (skill: string) => {
    const lowerSkill = skill.toLowerCase();
    if (lowerSkill.includes('program') || lowerSkill.includes('code') || lowerSkill.includes('dev')) return Code2;
    if (lowerSkill.includes('data') || lowerSkill.includes('analy')) return LineChart;
    if (lowerSkill.includes('communicat') || lowerSkill.includes('speak')) return MessageSquare;
    if (lowerSkill.includes('problem') || lowerSkill.includes('solve')) return Lightbulb;
    return Award;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Engineers Forward Header */}
      <div className="flex items-center gap-2 text-dark-blue/40 dark:text-white/20 font-black uppercase tracking-[0.3em] text-[9px]">
        <Building2 size={14} />
        Engineers Forward with technology
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-blue dark:bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest"
          >
            <Sparkles size={12} className="text-white" />
            <span>Tier 1 SDE Path • 2026</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-dark-blue dark:text-white tracking-tighter leading-none"
          >
            Strategic Career <br />
            <span className="text-slate-400 dark:text-slate-600">Roadmap 2026</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-dark-blue/40 dark:text-white/30 font-medium uppercase tracking-[0.2em]"
          >
            Strategic roadmap for you
          </motion.p>
        </div>

        {/* Strategic Analysis Graph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card !p-6 flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-[9px] font-black text-dark-blue/60 dark:text-white/60 uppercase tracking-widest">
               Core Strategic Analysis
             </h3>
             <Target size={14} className="text-dark-blue/20 dark:text-white/20" />
          </div>
          
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 9, fontWeight: 900, fill: 'var(--color-chart-text)' }} 
                />
                <Radar
                   name="Value"
                   dataKey="value"
                   stroke="var(--color-dark-blue)"
                   fill="var(--color-dark-blue)"
                   fillOpacity={0.15}
                   animationDuration={1500}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }}
                  itemStyle={{ color: '#0f172a' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Strategic Pillars */}
      {strategicAdvice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <CollapsibleAdvice 
            title="Tech Stack" 
            content={strategicAdvice.techStackRecommendation} 
            icon={<Code2 size={20} />} 
          />

          <CollapsibleAdvice 
            title="System Design" 
            content={strategicAdvice.systemDesignFocus} 
            icon={<Database size={20} />} 
          />

          <CollapsibleAdvice 
            title="AI Literacy" 
            content={strategicAdvice.aiIntegrationTips} 
            icon={<Sparkles size={20} />} 
          />

          <CollapsibleAdvice 
            title="DevOps" 
            content={strategicAdvice.devOpsEssentials} 
            icon={<Globe size={20} />} 
          />
        </motion.div>
      )}

      
      {/* Skill Gap Analyzer */}
      {analysis.skillGap && analysis.skillGap.length > 0 && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
        >
          <SkillGapAnalyzer skillGaps={analysis.skillGap} />
        </motion.div>
      )}

      {/* System Design path */}
      <motion.div
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.7 }}
      >
        <SystemDesignPath />
      </motion.div>

      {/* Top Recommended Career Paths */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-xs font-black text-dark-blue dark:text-white tracking-tight flex items-center gap-2 uppercase tracking-widest">
          <Target className="text-dark-blue dark:text-white/40" size={16} />
          Recommended Paths
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {targetJobs?.slice(0, 3).map((job, index) => {
            const Icon = getJobIcon(job.role);
            return (
              <div 
                key={index} 
                className="group p-6 glass-card !rounded-[2rem] flex flex-col h-full border-slate-200/50"
              >
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-dark-blue dark:text-white mb-4 group-hover:bg-dark-blue dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-dark-blue transition-all duration-300 shadow-sm">
                    <Icon size={20} />
                  </div>
                  
                  <h3 className="text-lg font-black text-dark-blue dark:text-white mb-1 tracking-tight">{job.role}</h3>
                  <p className="text-[9px] font-black text-dark-blue/40 dark:text-white/30 uppercase tracking-widest mb-4">{job.industry}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-[8px] font-black text-dark-blue/30 dark:text-white/20 uppercase tracking-widest mb-1">Impact Insight</p>
                      <p className="text-xs text-dark-blue/80 dark:text-white/60 font-medium leading-normal line-clamp-2">{job.reason}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black text-dark-blue dark:text-white">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span>{job.averageSalary}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => navigate('/roadmap')}
                    className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-dark-blue dark:hover:bg-white text-dark-blue dark:text-white dark:hover:text-dark-blue text-[9px] font-black transition-all duration-200 flex items-center justify-center gap-1.5 uppercase tracking-widest"
                  >
                    Explore Path <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Skills to Learn */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card !p-6"
        >
          <h2 className="text-xs font-black text-dark-blue dark:text-white tracking-tight mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Award className="text-dark-blue dark:text-white/40" size={16} />
            Skills to Master
          </h2>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills?.slice(0, 10).map((skill, index) => {
              const Icon = getSkillIcon(skill.skill);
              return (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-dark-blue dark:hover:bg-white hover:text-white dark:hover:text-dark-blue transition-all duration-200 cursor-default group"
                >
                  <Icon size={12} className="text-dark-blue dark:text-slate-400 group-hover:text-white dark:group-hover:text-dark-blue transition-colors" />
                  <span className="text-[10px] font-black text-dark-blue dark:text-slate-300 group-hover:text-white dark:group-hover:text-dark-blue uppercase tracking-widest">{skill.skill}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Next Steps Roadmap */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card !p-6"
        >
          <h2 className="text-xs font-black text-dark-blue dark:text-white tracking-tight mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Rocket className="text-dark-blue dark:text-white/40" size={16} />
            Next Steps
          </h2>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
            {[
              { step: 1, title: 'Learn essential skills', desc: 'Focus on identified gaps.' },
              { step: 2, title: 'Build projects', desc: 'Apply knowledge to real-world problems.' },
              { step: 3, title: 'Apply for internships', desc: 'Start professional networking.' },
              { step: 4, title: 'Career progression', desc: 'Iterate and improve constantly.' },
            ].map((item, index) => (
              <div key={index} className="relative flex items-start gap-6 group">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-dark-blue dark:bg-white text-white dark:text-dark-blue text-[9px] font-black shadow-md shrink-0 z-10">
                  {item.step}
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="font-black text-dark-blue dark:text-white text-[10px] mb-0.5 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-[10px] text-dark-blue/60 dark:text-white/40 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Career Opportunities */}
      {analysis.careerSummary && (
        <div className="pt-12">
          <CareerOpportunities analysis={analysis} />
        </div>
      )}

      {/* Download Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center pt-12"
      >
        <button className="px-12 py-5 rounded-3xl bg-dark-blue hover:bg-dark-blue-hover text-white font-black text-lg shadow-2xl transition-all duration-500 hover:scale-[1.05] flex items-center gap-4 uppercase tracking-[0.2em]">
          <Download size={24} />
          Download Career Plan
        </button>
      </motion.div>
      <PageNavigation />
      <MentorChat analysis={analysis} />
    </div>
  );
};

