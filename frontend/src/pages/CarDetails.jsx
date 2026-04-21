import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  MapPin,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { useCarStore } from '../store/useCarStore';
import { axiosInstance } from '../lib/axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { PriceDisplay, formatPrice } from '../components/ui/PriceDisplay';
import { Skeleton } from '../components/ui/Skeleton';
import { DateRangePicker } from '../components/ui/DateRangePicker';
import { useBookingStore } from '../store/useBookingStore';

function daysBetween(from, to) {
  if (!from || !to) return 0;
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function expandBlockedRanges(ranges) {
  const out = [];
  ranges.forEach(({ from, to }) => {
    const d = new Date(from);
    const end = new Date(to);
    while (d <= end) {
      out.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
  });
  return out;
}

const Gallery = ({ images, alt }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-[var(--color-elevated)]" />
    );
  }
  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));
  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[var(--color-elevated)]">
        <img
          src={images[idx]}
          alt={alt}
          className="h-full w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center hover:bg-black/80"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center hover:bg-black/80"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx
                  ? 'border-[var(--color-accent)]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const BookingWidget = ({ car, onContinue }) => {
  const [range, setRange] = useState({ from: null, to: null });
  const [blocked, setBlocked] = useState([]);

  useEffect(() => {
    if (!car?.id) return;
    axiosInstance
      .get(`cars/${car.id}/availability`)
      .then((res) => setBlocked(expandBlockedRanges(res.data.blockedRanges || [])))
      .catch(() => setBlocked([]));
  }, [car?.id]);

  const days = daysBetween(range.from, range.to);
  const daily = Number(car?.dailyRate || 0);
  const subtotal = +(daily * days).toFixed(2);
  const fees = +(subtotal * 0.1).toFixed(2);
  const deposit = Number(car?.depositAmount || 0);
  const total = +(subtotal + fees + deposit).toFixed(2);

  const canContinue = range.from && range.to && days >= 1;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">
          From
        </div>
        <PriceDisplay amount={car?.dailyRate} per="day" size="xl" />
      </div>

      <DateRangePicker
        value={range}
        onChange={setRange}
        disabledDates={blocked}
        months={1}
      />

      {canContinue && (
        <div className="space-y-2 text-sm pt-2 border-t border-[var(--color-border-subtle)]">
          <div className="flex justify-between text-[var(--color-muted)]">
            <span>
              {formatPrice(daily)} × {days} day{days > 1 ? 's' : ''}
            </span>
            <span className="text-[var(--color-text)]">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-[var(--color-muted)]">
            <span>Service fee</span>
            <span className="text-[var(--color-text)]">
              {formatPrice(fees)}
            </span>
          </div>
          <div className="flex justify-between text-[var(--color-muted)]">
            <span>Refundable deposit</span>
            <span className="text-[var(--color-text)]">
              {formatPrice(deposit)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[var(--color-border-subtle)] font-semibold">
            <span className="text-[var(--color-text)]">Total</span>
            <span className="text-[var(--color-text)]">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        disabled={!canContinue}
        onClick={() => onContinue(range)}
      >
        {canContinue ? 'Continue to book' : 'Select your dates'}
      </Button>

      <p className="text-xs text-[var(--color-muted)] text-center">
        Free cancellation up to 24 hours before pickup
      </p>
    </div>
  );
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { car, getCarById, isLoading } = useCarStore();
  const setDraft = useBookingStore((s) => s.setDraft);

  useEffect(() => {
    if (id) getCarById(id);
  }, [id, getCarById]);

  const specs = useMemo(() => {
    if (!car) return [];
    return [
      { label: 'Year', value: car.year },
      { label: 'Seats', value: car.seats || 5 },
      { label: 'Transmission', value: car.transmission || '—' },
      { label: 'Fuel', value: car.fuelType || '—' },
      { label: 'Drivetrain', value: car.drivetrain || '—' },
      { label: 'Engine', value: car.engineSize ? `${car.engineSize}L` : '—' },
      { label: 'Horsepower', value: car.horsepower ? `${car.horsepower} hp` : '—' },
      { label: '0–100 km/h', value: car.zeroToHundred ? `${car.zeroToHundred}s` : '—' },
    ];
  }, [car]);

  if (isLoading && !car) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Skeleton className="aspect-[16/9] w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mt-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Car not found</h1>
        <Link to="/listings" className="mt-4 inline-block text-[var(--color-accent)]">
          Back to fleet
        </Link>
      </div>
    );
  }

  const handleContinue = (range) => {
    setDraft({
      carId: car.id,
      car,
      startDate: range.from?.toISOString().slice(0, 10),
      endDate: range.to?.toISOString().slice(0, 10),
    });
    navigate('/booking');
  };

  const images = Array.isArray(car.imageUrls) ? car.imageUrls : [];

  return (
    <div className="bg-[var(--color-bg)] min-h-screen text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/listings"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-6"
        >
          <ArrowLeft size={14} /> Back to fleet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div>
            <Gallery images={images} alt={`${car.make} ${car.model}`} />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge tone="accent">{car.category}</Badge>
                <StatusBadge status={car.rentalStatus || 'available'} />
              </div>
              <div className="text-sm text-[var(--color-muted)] uppercase tracking-wider">
                {car.make} · {car.year}
              </div>
              <h1 className="mt-1 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
                {car.model}
              </h1>
              {car.description && (
                <p className="mt-5 text-[var(--color-muted)] leading-relaxed max-w-2xl">
                  {car.description}
                </p>
              )}

              {/* Specs */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {specs.map((s) => (
                  <Card key={s.label} className="p-4">
                    <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                      {s.label}
                    </div>
                    <div className="mt-1 text-sm font-medium text-[var(--color-text)]">
                      {s.value}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Feature blocks */}
              {['interior', 'exterior', 'comfort', 'safety'].map((key) => {
                const items = car[key];
                if (!items || !items.length) return null;
                return (
                  <div key={key} className="mt-10">
                    <h3 className="text-lg font-semibold capitalize mb-3">
                      {key}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((f, i) => (
                        <span
                          key={i}
                          className="text-sm px-3 py-1.5 rounded-full bg-[var(--color-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text)]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Rental policies */}
              <div className="mt-10 grid sm:grid-cols-3 gap-3">
                <Card className="p-4">
                  <Shield className="text-[var(--color-accent)] mb-2" size={18} />
                  <div className="text-sm font-medium">Insurance included</div>
                  <div className="text-xs text-[var(--color-muted)] mt-1">
                    Comprehensive coverage every mile.
                  </div>
                </Card>
                <Card className="p-4">
                  <Sparkles className="text-[var(--color-accent)] mb-2" size={18} />
                  <div className="text-sm font-medium">
                    {car.mileagePolicy || 'Unlimited miles'}
                  </div>
                  <div className="text-xs text-[var(--color-muted)] mt-1">
                    Drive as far as the road takes you.
                  </div>
                </Card>
                <Card className="p-4">
                  <Zap className="text-[var(--color-accent)] mb-2" size={18} />
                  <div className="text-sm font-medium">Instant unlock</div>
                  <div className="text-xs text-[var(--color-muted)] mt-1">
                    Your host meets you at pickup.
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Booking widget */}
          <aside>
            <div className="sticky top-24">
              <Card className="p-5">
                <BookingWidget car={car} onContinue={handleContinue} />
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
