import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Filter,
  SlidersHorizontal,
  Users,
  Gauge,
  Fuel,
  X,
} from 'lucide-react';
import { useCarStore } from '../store/useCarStore';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { Skeleton } from '../components/ui/Skeleton';

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
              {car.make} · {car.year}
            </div>
            <h3 className="mt-0.5 text-lg font-semibold text-[var(--color-text)]">
              {car.model}
            </h3>
          </div>
          <Badge tone={car.rentalStatus === 'available' ? 'success' : 'neutral'}>
            {car.rentalStatus || 'available'}
          </Badge>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)]">
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

const Listings = () => {
  const [params, setParams] = useSearchParams();
  const { cars, getCars, isLoading, pagination } = useCarStore();

  const [filters, setFilters] = useState({
    category: params.get('category') || '',
    transmission: params.get('transmission') || '',
    fuelType: params.get('fuelType') || '',
    minRate: params.get('minRate') || '',
    maxRate: params.get('maxRate') || '',
    seats: params.get('seats') || '',
  });
  const [sort, setSort] = useState(params.get('sort') || 'popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const q = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) q[k] = v;
    });
    getCars({ page: 1, limit: 24, ...q });
    const sp = new URLSearchParams();
    Object.entries({ ...filters, sort }).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    setParams(sp, { replace: true });
  }, [filters, sort, getCars, setParams]);

  const sortedCars = useMemo(() => {
    const list = [...(cars || [])];
    if (sort === 'price_asc')
      list.sort((a, b) => (a.dailyRate || 0) - (b.dailyRate || 0));
    if (sort === 'price_desc')
      list.sort((a, b) => (b.dailyRate || 0) - (a.dailyRate || 0));
    return list;
  }, [cars, sort]);

  const update = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const clear = () =>
    setFilters({
      category: '',
      transmission: '',
      fuelType: '',
      minRate: '',
      maxRate: '',
      seats: '',
    });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const FiltersPanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clear}
            className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            Clear all
          </button>
        )}
      </div>
      <Select
        label="Category"
        value={filters.category}
        onChange={(e) => update('category', e.target.value)}
      >
        <option value="">Any</option>
        <option value="luxury">Luxury</option>
        <option value="comfort">Comfort</option>
        <option value="sport">Sport</option>
        <option value="suv">SUV</option>
        <option value="budget">Budget</option>
        <option value="pickup">Pickup</option>
        <option value="ev">Electric</option>
      </Select>
      <Select
        label="Transmission"
        value={filters.transmission}
        onChange={(e) => update('transmission', e.target.value)}
      >
        <option value="">Any</option>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual</option>
        <option value="cvt">CVT</option>
        <option value="dual_clutch">Dual-clutch</option>
      </Select>
      <Select
        label="Fuel"
        value={filters.fuelType}
        onChange={(e) => update('fuelType', e.target.value)}
      >
        <option value="">Any</option>
        <option value="gasoline">Gasoline</option>
        <option value="diesel">Diesel</option>
        <option value="electric">Electric</option>
        <option value="hybrid">Hybrid</option>
      </Select>
      <Select
        label="Seats"
        value={filters.seats}
        onChange={(e) => update('seats', e.target.value)}
      >
        <option value="">Any</option>
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="7">7+</option>
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          label="Min $/day"
          value={filters.minRate}
          placeholder="0"
          onChange={(e) => update('minRate', e.target.value)}
        />
        <Input
          type="number"
          label="Max $/day"
          value={filters.maxRate}
          placeholder="500"
          onChange={(e) => update('maxRate', e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--color-bg)] min-h-screen text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight">
              The fleet
            </h1>
            <p className="mt-2 text-[var(--color-muted)]">
              {pagination?.totalItems || sortedCars.length} cars ready to drive.
            </p>
          </div>
          <div className="hidden sm:block">
            <Select
              label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="popular">Popular</option>
              <option value="price_asc">Price: low → high</option>
              <option value="price_desc">Price: high → low</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <Card className="p-5 sticky top-20">{FiltersPanel}</Card>
          </aside>

          {/* Mobile filter trigger */}
          <div className="lg:hidden -mt-4 mb-2">
            <Button
              variant="secondary"
              leftIcon={<SlidersHorizontal size={14} />}
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute right-0 top-0 h-full w-80 bg-[var(--color-surface)] border-l border-[var(--color-border-subtle)] p-5 overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold">Filters</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                {FiltersPanel}
              </div>
            </div>
          )}

          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-[16/10] w-full" />
                    <Skeleton className="mt-3 h-5 w-1/2" />
                    <Skeleton className="mt-2 h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : sortedCars.length === 0 ? (
              <Card className="p-12 text-center">
                <Filter
                  size={24}
                  className="mx-auto mb-3 text-[var(--color-muted)]"
                />
                <p className="text-[var(--color-muted)]">
                  No cars match these filters. Try widening your search.
                </p>
                <Button variant="outline" className="mt-4" onClick={clear}>
                  Clear filters
                </Button>
              </Card>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {sortedCars.map((c) => (
                  <FleetCard key={c.id} car={c} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
