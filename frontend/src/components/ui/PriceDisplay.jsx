import React from 'react';
import { cn } from './cn';

export function formatPrice(value, { currency = 'USD', locale = 'en-US' } = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
  }).format(Number(value));
}

export function PriceDisplay({
  amount,
  per = 'day',
  currency = 'USD',
  size = 'md',
  className,
}) {
  const sizes = {
    sm: { num: 'text-lg', suffix: 'text-xs' },
    md: { num: 'text-2xl', suffix: 'text-sm' },
    lg: { num: 'text-4xl', suffix: 'text-base' },
    xl: { num: 'text-5xl', suffix: 'text-lg' },
  };
  const s = sizes[size] || sizes.md;
  return (
    <span className={cn('inline-flex items-baseline gap-1', className)}>
      <span className={cn('font-display font-semibold tracking-tight text-[var(--color-text)]', s.num)}>
        {formatPrice(amount, { currency })}
      </span>
      {per && (
        <span className={cn('text-[var(--color-muted)]', s.suffix)}>/ {per}</span>
      )}
    </span>
  );
}

export default PriceDisplay;
