import React from 'react';
import clsx from 'clsx';

export interface SpinnerProps {
  size?: number;
  className?: string;
}

/** Indeterminate activity indicator — the only "loading" decoration used. */
export const Spinner: React.FC<SpinnerProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={clsx('animate-spin shrink-0', className)}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
