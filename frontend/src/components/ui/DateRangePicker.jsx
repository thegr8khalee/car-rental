import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './cn';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addMonths(d, n) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}
function sameDay(a, b) {
  return a && b && startOfDay(a).getTime() === startOfDay(b).getTime();
}
function inRange(d, a, b) {
  if (!a || !b) return false;
  const t = startOfDay(d).getTime();
  return t > startOfDay(a).getTime() && t < startOfDay(b).getTime();
}
function buildMonth(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0 Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  months = 2,
  className,
}) {
  const today = startOfDay(new Date());
  const [viewDate, setViewDate] = useState(
    value?.from ? startOfDay(value.from) : today
  );
  const [hover, setHover] = useState(null);

  const min = minDate ? startOfDay(minDate) : today;
  const max = maxDate ? startOfDay(maxDate) : null;
  const blocked = useMemo(
    () => new Set(disabledDates.map((d) => startOfDay(d).getTime())),
    [disabledDates]
  );

  const isDisabled = (d) => {
    if (!d) return false;
    const t = startOfDay(d).getTime();
    if (t < min.getTime()) return true;
    if (max && t > max.getTime()) return true;
    if (blocked.has(t)) return true;
    return false;
  };

  const onPick = (d) => {
    if (!d || isDisabled(d)) return;
    const from = value?.from;
    const to = value?.to;
    if (!from || (from && to)) {
      onChange?.({ from: d, to: null });
    } else if (d < from) {
      onChange?.({ from: d, to: null });
    } else if (sameDay(d, from)) {
      onChange?.({ from: null, to: null });
    } else {
      onChange?.({ from, to: d });
    }
  };

  const renderMonth = (offset) => {
    const d = addMonths(viewDate, offset);
    const cells = buildMonth(d.getFullYear(), d.getMonth());
    const label = d.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
    return (
      <div key={offset} className="flex-1 min-w-[260px]">
        <div className="mb-3 text-center text-sm font-semibold text-[var(--color-text)]">
          {label}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w, i) => (
            <div
              key={i}
              className="text-center text-[11px] font-medium text-[var(--color-muted)] py-1"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((c, i) => {
            if (!c) return <div key={i} />;
            const disabled = isDisabled(c);
            const isFrom = value?.from && sameDay(c, value.from);
            const isTo = value?.to && sameDay(c, value.to);
            const rangeEnd = value?.to || hover;
            const midRange =
              value?.from && rangeEnd && inRange(c, value.from, rangeEnd);
            const selected = isFrom || isTo;
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onMouseEnter={() => value?.from && !value?.to && setHover(c)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onPick(c)}
                className={cn(
                  'h-9 rounded-md text-sm transition-colors',
                  'text-[var(--color-text)]',
                  !selected && !midRange && 'hover:bg-[var(--color-elevated)]',
                  midRange && 'bg-[var(--color-accent)]/15 text-[var(--color-text)]',
                  selected && 'bg-[var(--color-accent)] text-[#04121a] font-semibold',
                  disabled && 'opacity-30 cursor-not-allowed line-through'
                )}
              >
                {c.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-4',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setViewDate(addMonths(viewDate, -1))}
          className="p-1.5 rounded-md text-[var(--color-muted)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text)]"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          className="p-1.5 rounded-md text-[var(--color-muted)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text)]"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {Array.from({ length: months }).map((_, i) => renderMonth(i))}
      </div>
    </div>
  );
}

export default DateRangePicker;
