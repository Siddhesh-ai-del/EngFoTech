import React from 'react';
import clsx from 'clsx';

type TagTone = 'neutral' | 'accent' | 'green' | 'orange' | 'red';

const toneClass: Record<TagTone, string> = {
  neutral: 'bg-inset text-label-2',
  accent: 'bg-accent/12 text-accent',
  green: 'bg-green/15 text-green-text',
  orange: 'bg-orange/15 text-orange-text',
  red: 'bg-red/15 text-red-text',
};

export interface TagProps {
  children: React.ReactNode;
  /** Color carries status meaning — never decoration (color.md › Best practices). */
  tone?: TagTone;
  className?: string;
}

/** Capsule chip for skills, statuses, and companies. */
export const Tag: React.FC<TagProps> = ({ children, tone = 'neutral', className }) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium leading-tight',
      toneClass[tone],
      className,
    )}
  >
    {children}
  </span>
);
