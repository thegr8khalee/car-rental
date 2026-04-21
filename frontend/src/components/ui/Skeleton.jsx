import React from 'react';
import { cn } from './cn';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--radius-md)] bg-[var(--color-elevated)]',
        className
      )}
      {...props}
    />
  );
}

export default Skeleton;
