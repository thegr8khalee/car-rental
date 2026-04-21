import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import {
  luxury,
  comfort,
  sport1 as sport,
  suv1 as suv,
  pickup1 as pickup,
  ev,
  budget,
} from '../config/images';
import { Button } from '../components/ui/Button';

const categories = [
  { name: 'Luxury', slug: 'luxury', src: luxury, description: 'Premium vehicles with the finest appointments.' },
  { name: 'Comfort', slug: 'comfort', src: comfort, description: 'Smooth, spacious, everyday-capable.' },
  { name: 'Sport', slug: 'sport', src: sport, description: 'Performance you feel from the first corner.' },
  { name: 'SUV', slug: 'suv', src: suv, description: 'Ready for the city and the backroad.' },
  { name: 'Pickup', slug: 'pickup', src: pickup, description: 'Capable trucks for work and play.' },
  { name: 'Budget', slug: 'budget', src: budget, description: 'Reliable, efficient, honestly priced.' },
  { name: 'EV', slug: 'ev', src: ev, description: 'Silent, instant, emissions-free.' },
];

const Categories = () => {
  const navigate = useNavigate();

  const goTo = (slug) => navigate(`/listings?category=${slug}`);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 mb-4">
            Categories
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Find your drive.
          </h1>
          <p className="mt-3 text-[var(--color-muted)] text-lg">
            Seven curated categories. One garage. Whatever the trip calls for.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <motion.button
              key={c.slug}
              onClick={() => goTo(c.slug)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-left hover:border-[var(--color-accent)]/40 transition-all hover:-translate-y-0.5"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[var(--color-elevated)]">
                <img
                  src={c.src}
                  alt={c.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">
                    {c.name}
                  </h3>
                  <ArrowUpRight
                    size={16}
                    className="text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {c.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Ready to roll?
        </h2>
        <p className="mt-3 text-[var(--color-muted)]">
          Skip the counter. Pick a car, pick your dates, pick up the keys.
        </p>
        <div className="mt-6">
          <Button size="lg" onClick={() => navigate('/listings')}>
            View the full fleet
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Categories;
