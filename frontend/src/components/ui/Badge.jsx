import React from 'react';
import { cn } from './cn';

const tones = {
  neutral:
    'bg-[var(--color-elevated)] text-[var(--color-muted)] border border-[var(--color-border-subtle)]',
  accent: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30',
  success: 'bg-[var(--color-ok)]/10 text-[var(--color-ok)] border border-[var(--color-ok)]/30',
  warning: 'bg-[var(--color-warn)]/10 text-[var(--color-warn)] border border-[var(--color-warn)]/30',
  danger: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/30',
};

export function Badge({ tone = 'neutral', className, children, icon, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }) {
  const map = {
    available: { tone: 'success', label: 'Available' },
    rented: { tone: 'accent', label: 'Rented' },
    maintenance: { tone: 'warning', label: 'Maintenance' },
    retired: { tone: 'neutral', label: 'Retired' },
    pending: { tone: 'warning', label: 'Pending' },
    confirmed: { tone: 'accent', label: 'Confirmed' },
    active: { tone: 'success', label: 'Active' },
    completed: { tone: 'neutral', label: 'Completed' },
    cancelled: { tone: 'danger', label: 'Cancelled' },
  };
  const cfg = map[status] || { tone: 'neutral', label: status };
  return (
    <Badge tone={cfg.tone} className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </Badge>
  );
}

export default Badge;
