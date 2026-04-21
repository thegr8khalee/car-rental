import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from './cn';

export const Select = React.forwardRef(function Select(
  { className, label, hint, error, children, id, ...props },
  ref
) {
  const selectId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-[13px] font-medium text-[var(--color-muted)]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full appearance-none rounded-[var(--radius-md)] bg-[var(--color-elevated)]',
            'border border-[var(--color-border-subtle)] px-4 py-3 pr-10 text-[15px] text-[var(--color-text)]',
            'transition-colors focus:border-[var(--color-accent)] focus:outline-none',
            error && 'border-[var(--color-danger)]',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
        />
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

export default Select;
