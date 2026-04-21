import React from 'react';
import { cn } from './cn';

export const Input = React.forwardRef(function Input(
  { className, label, hint, error, leftIcon, rightIcon, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[13px] font-medium text-[var(--color-muted)]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-[var(--radius-md)] bg-[var(--color-elevated)] border border-[var(--color-border-subtle)]',
            'px-4 py-3 text-[15px] text-[var(--color-text)] placeholder:text-[#5a5a63]',
            'transition-colors focus:border-[var(--color-accent)] focus:outline-none',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-[var(--color-danger)]',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
            {rightIcon}
          </span>
        )}
      </div>
      {hint && !error && (
        <p className="mt-1.5 text-xs text-[var(--color-muted)]">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>
      )}
    </div>
  );
});

export default Input;
