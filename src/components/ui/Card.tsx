import React from 'react';
import clsx from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/** Opaque content-layer surface — glass is reserved for the nav bar. */
export const Card: React.FC<CardProps> = ({ children, className }) => (
  <section className={clsx('card p-5', className)}>{children}</section>
);

export interface SectionHeadingProps {
  title: string;
  description?: string;
  /** Extra controls aligned to the trailing edge of the heading row. */
  action?: React.ReactNode;
  /** Heading rank — keep the document outline honest. */
  level?: 2 | 3;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  action,
  level = 2,
  className,
}) => {
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <div className={clsx('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <Heading
          className={clsx(
            'text-label font-semibold tracking-[-0.01em]',
            level === 2 ? 'text-[20px]' : 'text-[17px]',
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-1 text-[15px] leading-relaxed text-label-2">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
};
