import React from 'react';
import clsx from 'clsx';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** One prominent fill per view: `primary` for the action people came for. */
  variant?: ButtonVariant;
  /** Shows a spinner and swaps the label; keeps the button's width stable. */
  loading?: boolean;
  /** Read while loading, e.g. "Processing…" (buttons.md › Platform considerations). */
  loadingLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  loadingLabel,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={clsx(variantClass[variant], className)}
    {...rest}
  >
    {loading ? (
      <>
        <Spinner size={16} />
        {loadingLabel ?? children}
      </>
    ) : (
      children
    )}
  </button>
);
