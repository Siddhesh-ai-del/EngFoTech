import React, { useId } from 'react';
import clsx from 'clsx';

export interface FieldProps {
  /** Sentence-case label, wired to the control for screen readers. */
  label: string;
  /** Optional helper or validation text, associated via aria-describedby. */
  hint?: string;
  /** Receives the id + aria wiring; spread it onto the input/select/textarea. */
  children: (control: { id: string; 'aria-describedby': string | undefined }) => React.ReactNode;
  className?: string;
}

/**
 * Label + control + hint, always associated. The render-prop keeps the
 * element choice (input/select/textarea) with the caller while making the
 * accessible-name wiring impossible to forget.
 */
export const Field: React.FC<FieldProps> = ({ label, hint, children, className }) => {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={clsx('w-full', className)}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children({ id, 'aria-describedby': hintId })}
      {hint ? (
        <p id={hintId} className="mt-1.5 text-[13px] text-label-2 leading-snug">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
