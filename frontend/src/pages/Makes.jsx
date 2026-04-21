import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  audi1 as audi,
  bmw1 as bmw,
  honda1 as honda,
  benz1 as mercedes,
  toyota1 as toyota,
} from '../config/images';
import { Button } from '../components/ui/Button';

const makes = [
  { name: 'Mercedes-Benz', slug: 'mercedes', src: mercedes, tier: 'luxury', blurb: 'Flagship German luxury.' },
  { name: 'BMW', slug: 'bmw', src: bmw, tier: 'luxury', blurb: 'Performance with a sharp edge.' },
  { name: 'Audi', slug: 'audi', src: audi, tier: 'luxury', blurb: 'Quiet power, tailored tech.' },
  { name: 'Toyota', slug: 'toyota', src: toyota, tier: 'mainstream', blurb: 'Reliable, efficient, everywhere.' },
  { name: 'Honda', slug: 'honda', src: honda, tier: 'mainstream', blurb: 'Engineered for daily life.' },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'mainstream', label: 'Mainstream' },
];

const Makes = () => {
  const [q, setQ] = useState('');
  const [tier, setTier] = useState('all');
  const navigate = useNavigate();

  const filtered = makes.filter(
    (m) =>
      m.name.toLowerCase().includes(q.toLowerCase()) &&
      (tier === 'all' || m.tier === tier)
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 mb-4">
            Makes
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Drive the marque you love.
          </h1>
          <p className="mt-3 text-[var(--color-muted)] text-lg">
            From German luxury to Japanese reliability — every make in our
            garage is maintained to spec.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
            <input
              type="text"
              placeholder="Search makes…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setTier(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tier === c.id
                    ? 'bg-[var(--color-accent)] text-black'
                    : 'bg-[var(--color-elevated)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-muted)]">
            No makes match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m, i) => (
              <motion.button
                key={m.slug}
                onClick={() => navigate(`/listings?make=${m.slug}`)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group text-left overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 transition-all hover:-translate-y-0.5"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[var(--color-elevated)]">
                  <img
                    src={m.src}
                    alt={m.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{m.name}</h3>
                    <ArrowUpRight size={16} className="text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{m.blurb}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Looking for something specific?
        </h2>
        <p className="mt-3 text-[var(--color-muted)]">
          Reach out — we'll see what we can line up from the extended fleet.
        </p>
        <div className="mt-6">
          <Button size="lg" onClick={() => navigate('/contact')}>
            Contact us
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Makes;
