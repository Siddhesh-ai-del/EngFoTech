import React from 'react';
import { Briefcase, TrendingUp, Building2, Rocket, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '../types';
import { Card, SectionHeading } from './ui/Card';
import { Tag } from './ui/Tag';

interface CareerOpportunitiesProps {
  analysis: AnalysisResult;
}

const ColumnLabel: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <h3 className="text-[13px] font-medium text-label-2 mb-3 flex items-center gap-1.5">
    {icon}
    {children}
  </h3>
);

export const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({ analysis }) => {
  // Real LLM payloads can be partial even when the declared type is complete —
  // every array/scalar read below is guarded so a missing field degrades to an
  // empty section instead of crashing the app.
  const summary = analysis.careerSummary;
  if (!summary || typeof summary !== 'object') return null;

  const recommendedRoles = Array.isArray(summary.recommendedRoles) ? summary.recommendedRoles : [];
  const trendingRoles = Array.isArray(summary.trendingRoles) ? summary.trendingRoles : [];
  const suitableIndustries = Array.isArray(summary.suitableIndustries)
    ? summary.suitableIndustries
    : [];
  const hiringCompanies = Array.isArray(summary.hiringCompanies) ? summary.hiringCompanies : [];
  const nextSteps = Array.isArray(summary.nextSteps) ? summary.nextSteps : [];
  const compatibilityScore =
    typeof summary.compatibilityScore === 'number' && Number.isFinite(summary.compatibilityScore)
      ? Math.round(summary.compatibilityScore)
      : null;
  const whyFit =
    typeof summary.whyFit === 'string' && summary.whyFit.trim() !== '' ? summary.whyFit : null;

  return (
    <div className="mt-8">
      <Card>
        <SectionHeading
          title="Career Opportunities"
          description="AI Synthesis Result"
          className="mb-6"
          action={
            compatibilityScore !== null ? (
              <div className="inset flex items-center gap-3 px-4 py-2">
                <div className="text-right">
                  <p className="text-[13px] font-medium text-label-2 leading-none mb-1.5">
                    Compatibility
                  </p>
                  <p className="text-[20px] font-semibold text-label leading-none">
                    {compatibilityScore}%
                  </p>
                </div>
                <div className="w-8 h-8 rounded-[10px] bg-green/15 flex items-center justify-center text-green-text shrink-0">
                  <CheckCircle2 size={16} />
                </div>
              </div>
            ) : undefined
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div>
              <ColumnLabel icon={<Briefcase size={14} />}>Recommended Roles</ColumnLabel>
              <ul className="space-y-2">
                {recommendedRoles.map((role, i) => (
                  <li key={i} className="text-[15px] text-label flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-label-3 shrink-0"
                    />
                    {role}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ColumnLabel icon={<TrendingUp size={14} />}>Market Trending</ColumnLabel>
              <ul className="space-y-2">
                {trendingRoles.map((role, i) => (
                  <li key={i} className="text-[15px] text-label flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-label-3 shrink-0"
                    />
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <ColumnLabel icon={<Building2 size={14} />}>Focus Industries</ColumnLabel>
              <div className="flex flex-wrap gap-2">
                {suitableIndustries.map((ind, i) => (
                  <Tag key={i}>{ind}</Tag>
                ))}
              </div>
            </div>
            <div>
              <ColumnLabel icon={<Building2 size={14} />}>Target Companies</ColumnLabel>
              <div className="flex flex-wrap gap-2">
                {hiringCompanies.map((comp, i) => (
                  <Tag key={i}>{comp}</Tag>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {whyFit && (
              <div className="inset p-4">
                <h3 className="text-[13px] font-medium text-label-2 mb-2">Role Alignment</h3>
                <p className="text-[15px] text-label-2 leading-relaxed italic">"{whyFit}"</p>
              </div>
            )}
            <div>
              <ColumnLabel icon={<Rocket size={14} />}>Strategic Steps</ColumnLabel>
              <ol className="space-y-3">
                {nextSteps.map((step, i) => (
                  <li key={i} className="text-[15px] text-label flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-fill text-white flex items-center justify-center text-[12px] font-semibold mt-0.5"
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
