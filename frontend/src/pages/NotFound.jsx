import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFound = () => (
  <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col items-center justify-center px-6 text-center">
    <div className="font-display text-7xl sm:text-8xl font-semibold tracking-tight text-[var(--color-accent)]">
      404
    </div>
    <p className="mt-3 text-[var(--color-muted)] text-lg">
      This page took a wrong turn.
    </p>
    <Link to="/" className="mt-6">
      <Button size="lg">Back to home</Button>
    </Link>
  </div>
);

export default NotFound;
