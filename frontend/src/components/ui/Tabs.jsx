import React, { createContext, useContext, useState } from 'react';
import { cn } from './cn';

const TabsCtx = createContext(null);

export function Tabs({ value, defaultValue, onValueChange, children, className }) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value !== undefined ? value : internal;
  const setActive = (v) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <TabsCtx.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-1',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }) {
  const ctx = useContext(TabsCtx);
  const isActive = ctx?.active === value;
  return (
    <button
      type="button"
      onClick={() => ctx?.setActive(value)}
      className={cn(
        'rounded-[var(--radius-pill)] px-4 py-1.5 text-sm font-medium transition-all',
        isActive
          ? 'bg-[var(--color-accent)] text-[#04121a]'
          : 'text-[var(--color-muted)] hover:text-[var(--color-text)]',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const ctx = useContext(TabsCtx);
  if (ctx?.active !== value) return null;
  return <div className={cn('mt-4', className)}>{children}</div>;
}

export default Tabs;
