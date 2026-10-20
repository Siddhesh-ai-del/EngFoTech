import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { SkillGap } from '../types';
import { SectionHeading } from './ui/Card';
import { Tag } from './ui/Tag';

interface SkillGapAnalyzerProps {
  skillGaps: SkillGap[];
}

const priorityTone: Record<SkillGap['priority'], 'red' | 'orange' | 'green'> = {
  High: 'red',
  Medium: 'orange',
  Low: 'green',
};

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ skillGaps }) => {
  return (
    <div className="space-y-4">
      <SectionHeading
        title="Skill Gaps"
        action={
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-label-2">
            <Star size={14} className="text-orange" />
            AI Analysis
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillGaps.map((gap, idx) => {
          const missingSkills = Array.isArray(gap.missingSkills) ? gap.missingSkills : [];
          const difficulty = Number.isFinite(gap.difficulty)
            ? Math.min(Math.max(gap.difficulty, 0), 10)
            : 0;
          return (
            <div key={idx} className="card p-5 space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill, i) => (
                  <Tag key={i}>{skill}</Tag>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="font-medium text-label-2">Priority</span>
                  <Tag tone={priorityTone[gap.priority]}>{gap.priority}</Tag>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-label-2">Difficulty</span>
                    <span className="font-semibold text-label">{gap.difficulty}/10</span>
                  </div>
                  <div
                    className="h-1.5 bg-inset rounded-full overflow-hidden"
                    role="progressbar"
                    aria-label="Difficulty"
                    aria-valuenow={gap.difficulty}
                    aria-valuemin={0}
                    aria-valuemax={10}
                  >
                    <div
                      className="h-full bg-accent-fill rounded-full transition-[width] duration-200"
                      style={{ width: `${difficulty * 10}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 inset px-3 py-2 text-[13px] text-label-2">
                  <TrendingUp size={14} className="text-label-3 shrink-0" />
                  Time: {gap.estimatedTime}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
