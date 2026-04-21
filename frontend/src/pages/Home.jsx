import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  Shield,
  Sparkles,
  Zap,
  Users,
  Gauge,
  Fuel,
  Key,
} from 'lucide-react';
import { useCarStore } from '../store/useCarStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { Badge } from '../components/ui/Badge';

const CATEGORIES = [
  { id: 'luxury', label: 'Luxury', blurb: 'Premium cabins, S-class comfort' },
  { id: 'sport', label: 'Sport', blurb: 'Supercars & GT coupes' },
  { id: 'suv', label: 'SUV', blurb: 'Family & off-road ready' },
  { id: 'ev', label: 'Electric', blurb: 'Silent, quick, clean' },
  { id: 'comfort', label: 'Comfort', blurb: 'Daily-driver sedans' },
  { id: 'pickup', label: 'Pickup', blurb: 'Work & weekend haulers' },
];

const todayISO = () => new Date().toISOString().slice(0, 10);
const inDaysISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

function FleetCard({ car }) {
  const img =
    (Array.isArray(car.imageUrls) && car.imageUrls[0]) ||
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800';
  return (
    <Link
      to={`/car/${car.id}`}
      className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/40 transition-all hover:-translate-y-0.5"
    >
      <div className="aspect-[16/10] overflow-hidden bg-[var(--color-elevated)]">
        <img
          src={img}
          alt={`${car.make} ${car.model}`}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider">
              {car.make}
            </div>
            <h3 className="mt-0.5 text-lg font-semibold text-[var(--color-text)]">
              {car.model}
            </h3>
          </div>
          <Badge tone="accent">{car.category || 'rental'}</Badge>
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs text-[var(--color-muted)]">
          <span className="inline-flex items-center gap-1">
            <Users size={13} /> {car.seats || 5}
          </span>
          <span className="inline-flex items-center gap-1">
            <Gauge size={13} /> {car.transmission || 'auto'}
          </span>
          <span className="inline-flex items-center gap-1">
            <Fuel size={13} /> {car.fuelType || 'gas'}
          </span>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <PriceDisplay amount={car.dailyRate} per="day" size="md" />
          <span className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
            Book <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SearchWidget() {
  const navigate = useNavigate();
  const [from, setFrom] = useState(todayISO());
  const [to, setTo] = useState(inDaysISO(3));
  const [location, setLocation] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (location) params.set('location', location);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="glass rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-3 items-end"
    >
      <Select
        label="Pickup location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">Any city</option>
        <option value="Abuja">Abuja</option>
        <option value="Lagos">Lagos</option>
        <option value="Port Harcourt">Port Harcourt</option>
      </Select>
      <Input
        type="date"
        label="Pickup"
        value={from}
        min={todayISO()}
        onChange={(e) => setFrom(e.target.value)}
      />
      <Input
        type="date"
        label="Return"
        value={to}
        min={from}
        onChange={(e) => setTo(e.target.value)}
      />
      <Button type="submit" size="lg" rightIcon={<ArrowRight size={16} />}>
        Find cars
      </Button>
    </form>
  );
}

const Home = () => {
  const { cars, getCars } = useCarStore();
  useEffect(() => {
    getCars({ page: 1, limit: 8 });
  }, [getCars]);

  const featured = useMemo(() => (cars || []).slice(0, 6), [cars]);

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 via-transparent to-transparent" />
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge tone="accent" className="mb-6">
              <Sparkles size={12} /> Premium rental, on demand
            </Badge>
            <h1 className="font-hero text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-[var(--color-text)]">
              Drive anything.
              <br />
              <span className="gradient-text">Anywhere. Anytime.</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-muted)] max-w-xl">
              Unlock a car in minutes. No counters, no paperwork. Just pick
              your dates, your ride, and go.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10"
          >
            <SearchWidget />
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[var(--color-muted)]">
            <span className="inline-flex items-center gap-2">
              <Shield size={16} className="text-[var(--color-accent)]" /> Insured
              every mile
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap size={16} className="text-[var(--color-accent)]" /> Instant
              unlock
            </span>
            <span className="inline-flex items-center gap-2">
              <Key size={16} className="text-[var(--color-accent)]" /> 24/7
              support
            </span>
          </div>
        </div>
      </section>

      {/* Featured fleet */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Featured fleet
            </h2>
            <p className="mt-2 text-[var(--color-muted)]">
              Hand-picked for the drive you deserve.
            </p>
          </div>
          <Link
            to="/listings"
            className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] inline-flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((c) => (
            <FleetCard key={c.id} car={c} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-8">
          Find your category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/listings?category=${cat.id}`}
              className="group rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent)]/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                {cat.label}
              </div>
              <div className="mt-1 text-xs text-[var(--color-muted)]">
                {cat.blurb}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
          Three steps. One great drive.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <MapPin size={22} />,
              title: 'Pick a ride',
              blurb:
                'Browse the fleet, filter by what matters — seats, transmission, rate.',
            },
            {
              icon: <Calendar size={22} />,
              title: 'Choose your dates',
              blurb:
                'Same-day bookings welcome. Flexible cancellation up to 24 hours before pickup.',
            },
            {
              icon: <Key size={22} />,
              title: 'Unlock & go',
              blurb:
                'Show up, scan, drive. A Velocity host meets you at the agreed location.',
            },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6"
            >
              <div className="h-11 w-11 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mb-5">
                {s.icon}
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{s.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[var(--color-accent)]/15 via-[var(--color-surface)] to-[var(--color-surface)] p-10 sm:p-16">
          <div className="max-w-2xl">
            <h2 className="font-hero text-4xl sm:text-5xl leading-tight">
              Your next drive starts here.
            </h2>
            <p className="mt-4 text-[var(--color-muted)]">
              Join 20,000+ drivers who skipped the queue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/listings">
                <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                  Browse fleet
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline">
                  Create an account
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />
        </div>
      </section>
    </div>
  );
};

export default Home;
