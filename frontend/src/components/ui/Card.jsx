import React from 'react';
import { cn } from './cn';

export function Card({ className, interactive = false, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border-subtle)]',
        'transition-all duration-300',
        interactive &&
          'hover:border-[var(--color-accent)]/40 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'px-5 py-4 border-b border-[var(--color-border-subtle)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
