import React from 'react';
import { cn } from './cn';

const variants = {
  primary:
    'bg-[var(--color-accent)] text-[#04121a] hover:bg-[var(--color-accent-hover)] shadow-[0_8px_24px_-10px_rgba(34,211,238,0.6)]',
  secondary:
    'bg-[var(--color-elevated)] text-[var(--color-text)] hover:bg-[#26262e] border border-[var(--color-border-subtle)]',
  ghost:
    'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-elevated)]',
  outline:
    'bg-transparent text-[var(--color-text)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
  destructive:
    'bg-[var(--color-danger)] text-white hover:bg-[#ef4444]',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base',
};

export const Button = React.forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    className,
    children,
    type = 'button',
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium tracking-tight',
        'transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export default Button;
