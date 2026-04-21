import React from 'react';

export default function Skeleton({ className = '', style = {}, height = 24, width = '100%' }) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-elevated)] rounded ${className}`}
      style={{ height, width, ...style }}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}
