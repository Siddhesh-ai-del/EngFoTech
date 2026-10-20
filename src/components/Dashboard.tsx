import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  Sparkles,
  ArrowRight,
  Download,
  Code2,
  LineChart,
  MessageSquare,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Database,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { AnalysisResult } from '../types';
import { CareerOpportunities } from './CareerOpportunities';
import { PageNavigation } from './PageNavigation';

import { MentorChat } from './MentorChat';
import { SkillGapAnalyzer } from './SkillGapAnalyzer';
import { SystemDesignPath } from './SystemDesignPath';
import { Button } from './ui/Button';
import { Card, SectionHeading } from './ui/Card';

interface DashboardProps {
  analysis: AnalysisResult;
}

const CollapsibleAdvice: React.FC<{
  title: string;
  content: string;
  icon: React.ReactNode;
  preview?: string;
}> = ({ title, content, icon, preview }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="card p-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 text-left group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-[10px] bg-inset flex items-center justify-center text-accent shrink-0">
            {icon}
          </div>
          <h3 className="text-[17px] font-semibold text-label truncate">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-label-2 shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-label-2 shrink-0" />
        )}
      </button>
      {!isOpen && preview && (
        <p className="text-[13px] font-medium text-label-2 mt-3 line-clamp-1">{preview}</p>
      )}
      {isOpen && (
        <p className="text-[15px] text-label-2 leading-relaxed mt-4 pt-4 border-t border-separator whitespace-pre-wrap">
          {content}
        </p>
      )}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ analysis }) => {
  const navigate = useNavigate();
  const { targetJobs, recommendedSkills, strategicAdvice, strategicMetrics } = analysis;

  const chartData = [
    {
      subject: 'Skills',
      value: strategicMetrics?.skills ?? 85,
      fullMark: 100,
      hint: 'Technical & Soft Skills',
    },
    {
      subject: 'Interests',
      value: strategicMetrics?.interests ?? 80,
      fullMark: 100,
      hint: 'Passion & Curiosity',
    },
    {
      subject: 'Academia',
      value: strategicMetrics?.academicPerformance ?? 75,
      fullMark: 100,
      hint: 'CGPA & Coursework',
    },
    {
      subject: 'Strategy',
      value: strategicMetrics?.strategy ?? 70,
      fullMark: 100,
      hint: 'Career Planning',
    },
    {
      subject: 'Demand',
      value: strategicMetrics?.marketDemand ?? 90,
      fullMark: 100,
      hint: 'Job Market Growth',
    },
  ];
  const getJobIcon = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (
      lowerRole.includes('software') ||
      lowerRole.includes('developer') ||
      lowerRole.includes('engineer')
    )
      return Code2;
    if (lowerRole.includes('data') || lowerRole.includes('analyst')) return LineChart;
    if (lowerRole.includes('product') || lowerRole.includes('manager')) return Target;
    if (lowerRole.includes('design') || lowerRole.includes('ui')) return Lightbulb;
    return Briefcase;
  };

  const getSkillIcon = (skill: string) => {
    const lowerSkill = skill.toLowerCase();
    if (lowerSkill.includes('program') || lowerSkill.includes('code') || lowerSkill.includes('dev'))
      return Code2;
    if (lowerSkill.includes('data') || lowerSkill.includes('analy')) return LineChart;
    if (lowerSkill.includes('communicat') || lowerSkill.includes('speak')) return MessageSquare;
    if (lowerSkill.includes('problem') || lowerSkill.includes('solve')) return Lightbulb;
    return Award;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Engineers Forward Header */}
      <div className="flex items-center gap-2 text-[13px] font-medium text-label-2">
        <Building2 size={16} />
        Engineers Forward with technology
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <span className="inline-flex items-center gap-2 chip">
            <Sparkles size={14} className="text-accent" />
            <span>Tier 1 SDE Path • 2026</span>
          </span>
          <h1 className="text-[34px] font-bold tracking-[-0.025em] text-label leading-[1.1]">
            Strategic Career <br />
            <span className="text-label-2">Roadmap 2026</span>
          </h1>
          <p className="text-[15px] text-label-2">Strategic roadmap for you</p>
        </div>

        {/* Strategic Analysis Graph */}
        <div className="card p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-semibold text-label">Core Strategic Analysis</h3>
            <Target size={16} className="text-label-3" />
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="var(--lab-separator)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: 'var(--lab-label-2)' }}
                />
                <Radar
                  name="Value"
                  dataKey="value"
                  stroke="var(--lab-accent-fill)"
                  fill="var(--lab-accent-fill)"
                  fillOpacity={0.15}
                  animationDuration={300}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--lab-surface)',
                    border: '1px solid var(--lab-separator)',
                    borderRadius: '10px',
                    boxShadow: 'var(--shadow-pop)',
                    fontSize: '13px',
                    fontWeight: 400,
                    padding: '8px 12px',
                  }}
                  labelStyle={{ color: 'var(--lab-label)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--lab-label-2)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strategic Pillars */}
      {strategicAdvice && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CollapsibleAdvice
            title="Tech Stack"
            content={strategicAdvice.techStackRecommendation}
            icon={<Code2 size={18} />}
          />

          <CollapsibleAdvice
            title="System Design"
            content={strategicAdvice.systemDesignFocus}
            icon={<Database size={18} />}
          />

          <CollapsibleAdvice
            title="AI Literacy"
            content={strategicAdvice.aiIntegrationTips}
            icon={<Sparkles size={18} />}
          />

          <CollapsibleAdvice
            title="DevOps"
            content={strategicAdvice.devOpsEssentials}
            icon={<Globe size={18} />}
          />
        </div>
      )}

      {/* Skill Gap Analyzer */}
      {analysis.skillGap && analysis.skillGap.length > 0 && (
        <SkillGapAnalyzer skillGaps={analysis.skillGap} />
      )}

      {/* System Design path */}
      <SystemDesignPath />

      {/* Top Recommended Career Paths */}
      <div className="space-y-4">
        <SectionHeading title="Recommended Paths" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {targetJobs?.slice(0, 3).map((job, index) => {
            const Icon = getJobIcon(job.role);
            return (
              <div key={index} className="card p-6 flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-[10px] bg-inset flex items-center justify-center text-accent mb-4">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-[17px] font-semibold text-label mb-1">{job.role}</h3>
                  <p className="text-[13px] font-medium text-label-2 mb-4">{job.industry}</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-[13px] font-medium text-label-2 mb-1">Impact Insight</p>
                      <p className="text-[15px] text-label-2 leading-normal line-clamp-2">
                        {job.reason}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[15px] font-semibold text-label">
                        <TrendingUp size={16} className="text-green-text" />
                        <span>{job.averageSalary}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-separator">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/roadmap')}
                    className="w-full"
                  >
                    Explore Path <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Skills to Learn */}
        <Card>
          <SectionHeading title="Skills to Master" className="mb-5" />
          <div className="flex flex-wrap gap-2">
            {recommendedSkills?.slice(0, 10).map((skill, index) => {
              const Icon = getSkillIcon(skill.skill);
              return (
                <span key={index} className="chip">
                  <Icon size={14} className="text-label-3" />
                  {skill.skill}
                </span>
              );
            })}
          </div>
        </Card>

        {/* Next Steps Roadmap */}
        <Card>
          <SectionHeading title="Next Steps" className="mb-5" />
          <ol className="space-y-4 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-separator">
            {[
              { step: 1, title: 'Learn essential skills', desc: 'Focus on identified gaps.' },
              { step: 2, title: 'Build projects', desc: 'Apply knowledge to real-world problems.' },
              { step: 3, title: 'Apply for internships', desc: 'Start professional networking.' },
              { step: 4, title: 'Career progression', desc: 'Iterate and improve constantly.' },
            ].map((item) => (
              <li key={item.step} className="relative flex items-start gap-4">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-fill text-white text-[12px] font-semibold shrink-0 z-10">
                  <span aria-hidden="true">{item.step}</span>
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="text-[15px] font-semibold text-label mb-0.5">{item.title}</h3>
                  <p className="text-[13px] text-label-2 leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Career Opportunities */}
      {analysis.careerSummary && (
        <div className="pt-4">
          <CareerOpportunities analysis={analysis} />
        </div>
      )}

      {/* Download Button */}
      <div className="flex justify-center pt-8">
        <Button variant="primary" className="gap-3">
          <Download size={18} />
          Download Career Plan
        </Button>
      </div>
      <PageNavigation />
      <MentorChat analysis={analysis} />
    </div>
  );
};
